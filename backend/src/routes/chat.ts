import express, { Response } from 'express';
import { streamText } from 'ai';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';
import { getModel } from '../lib/ai-providers';

const router = express.Router();

// Helper to create error response
const createError = (code: string, message: string) => ({ code, message });

// Create or continue a chat conversation
router.post('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:chat', 'You need to sign in to view this chat. Please sign in and try again.'));
    }

    const { id, message, selectedChatModel, selectedVisibilityType } = req.body;

    if (!message && !id) {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    let chat;

    // If id is provided, verify it belongs to the user
    if (id) {
      chat = await prisma.chat.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!chat) {
        // Check if chat exists but belongs to another user
        const existingChat = await prisma.chat.findUnique({
          where: { id: id },
        });

        if (existingChat) {
          return res.status(403).json(createError('forbidden:chat', 'This chat belongs to another user. Please check the chat ID and try again.'));
        }

        return res.status(404).json(createError('not_found:chat', 'The requested chat was not found. Please check the chat ID and try again.'));
      }
    } else {
      // Create a new chat
      chat = await prisma.chat.create({
        data: {
          id: id,
          userId: userId,
          title: typeof message === 'string' ? message.substring(0, 100) : 'New Chat',
          visibility: selectedVisibilityType || 'private',
        },
      });
    }

    // Save the user message
    let userMessage;
    if (message && typeof message === 'string') {
      userMessage = await prisma.message_v2.create({
        data: {
          chatId: chat.id,
          role: 'user',
          parts: { text: message },
          attachments: {},
        },
      });
    }

    // Get chat history for context
    const messages = await prisma.message_v2.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' },
      take: 50, // Limit context to last 50 messages
    });

    // Convert to AI SDK message format
    const chatMessages = messages.map((msg) => {
      const parts = msg.parts as any;
      return {
        role: msg.role as 'user' | 'assistant',
        content: parts.text || parts.content || '',
      };
    });

    // Get the selected model
    const model = getModel(selectedChatModel);

    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx

    try {
      // Stream AI response
      const result = streamText({
        model,
        messages: chatMessages,
      });

      let fullResponse = '';

      // Stream the response to the client
      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        // Send in AI SDK stream format
        res.write(`0:"${chunk.replace(/"/g, '\\"')}"\n`);
      }

      // Save the AI response to database
      await prisma.message_v2.create({
        data: {
          chatId: chat.id,
          role: 'assistant',
          parts: { text: fullResponse },
          attachments: {},
        },
      });

      // Update chat's last context with usage info
      const usage = await result.usage;
      if (usage && usage.totalTokens) {
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            lastContext: {
              totalTokens: usage.totalTokens,
            },
          },
        });
      }

      res.end();
    } catch (error: any) {
      console.error('Error streaming AI response:', error);
      res.write(`e:"${error.message || 'An error occurred while generating response'}"\n`);
      res.end();
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json(createError('database:chat', 'An error occurred while executing a database query.'));
  }
});

// Delete a chat
router.delete('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.query;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:chat', 'You need to sign in to view this chat. Please sign in and try again.'));
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    // Check if chat exists and belongs to user
    const chat = await prisma.chat.findUnique({
      where: { id: id },
    });

    if (!chat) {
      return res.status(404).json(createError('not_found:chat', 'The requested chat was not found. Please check the chat ID and try again.'));
    }

    if (chat.userId !== userId) {
      return res.status(403).json(createError('forbidden:chat', 'This chat belongs to another user. Please check the chat ID and try again.'));
    }

    // Delete chat and related data (messages, votes, streams)
    await prisma.$transaction([
      prisma.vote_v2.deleteMany({ where: { chatId: id } }),
      prisma.stream.deleteMany({ where: { chatId: id } }),
      prisma.message_v2.deleteMany({ where: { chatId: id } }),
      prisma.chat.delete({ where: { id: id } }),
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json(createError('database:chat', 'An error occurred while executing a database query.'));
  }
});

// Stream chat response
router.get('/:id/stream', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: chatId } = req.params;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:chat', 'You need to sign in to view this chat. Please sign in and try again.'));
    }

    // Verify the chat belongs to the user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: userId,
      },
    });

    if (!chat) {
      return res.status(404).json(createError('not_found:chat', 'The requested chat was not found. Please check the chat ID and try again.'));
    }

    // Check if there's an existing stream
    const existingStream = await prisma.stream.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });

    // Get chat messages for context
    const messages = await prisma.message_v2.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    // Convert to AI SDK message format
    const chatMessages = messages.map((msg) => {
      const parts = msg.parts as any;
      return {
        role: msg.role as 'user' | 'assistant',
        content: parts.text || parts.content || '',
      };
    });

    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Create a new stream record
    const stream = await prisma.stream.create({
      data: {
        chatId: chat.id,
      },
    });

    try {
      // Get the model (use chat model as default)
      const model = getModel();

      // Stream AI response
      const result = streamText({
        model,
        messages: chatMessages,
      });

      let fullResponse = '';

      // Stream the response to the client
      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        res.write(`0:"${chunk.replace(/"/g, '\\"')}"\n`);
      }

      // Save the AI response to database
      await prisma.message_v2.create({
        data: {
          chatId: chat.id,
          role: 'assistant',
          parts: { text: fullResponse },
          attachments: {},
        },
      });

      res.end();
    } catch (error: any) {
      console.error('Error in resumable stream:', error);
      res.write(`e:"${error.message || 'An error occurred during streaming'}"\n`);
      res.end();
    }
  } catch (error) {
    console.error('Error in stream endpoint:', error);
    res.status(500).json(createError('database:chat', 'An error occurred while executing a database query.'));
  }
});

export default router;
