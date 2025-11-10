import express, { Response } from 'express';
import { streamText } from 'ai';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

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
    if (message && typeof message === 'string') {
      await prisma.message_v2.create({
        data: {
          chatId: chat.id,
          role: 'user',
          parts: { text: message },
          attachments: {},
        },
      });
    }

    // TODO: Implement AI streaming with proper model integration
    // This would require:
    // 1. Setting up AI provider (Azure OpenAI, OpenAI, etc.)
    // 2. Implementing streamText with proper context and tools
    // 3. Saving AI response to database
    // 4. Handling streaming responses in SSE format
    
    // For now, return a mock streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send a simple mock response
    res.write(`0:""\n`);
    res.write(`data: {"id":"${chat.id}","role":"assistant","content":"Chat functionality requires AI provider configuration"}\n\n`);
    res.end();
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

    // TODO: Implement resumable streaming
    // This would require:
    // 1. Checking for existing stream in database
    // 2. Resuming from last known position
    // 3. Setting up SSE (Server-Sent Events)
    // 4. Streaming AI response

    res.status(501).json({ 
      error: 'Stream endpoint not yet fully implemented',
      message: 'Streaming requires AI provider and resumable stream configuration'
    });
  } catch (error) {
    console.error('Error in stream endpoint:', error);
    res.status(500).json(createError('database:chat', 'An error occurred while executing a database query.'));
  }
});

export default router;
