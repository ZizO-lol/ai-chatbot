import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Helper to create error response
const createError = (code: string, message: string) => ({ code, message });

// Vote on a message (upvote/downvote)
router.post('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, messageId, isUpvoted } = req.body;

    if (!chatId || !messageId || typeof isUpvoted !== 'boolean') {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:vote', 'You need to sign in before continuing.'));
    }

    // Verify the chat belongs to the user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: userId,
      },
    });

    if (!chat) {
      return res.status(404).json(createError('not_found:vote', 'The requested chat was not found.'));
    }

    // Verify the message exists in the chat
    const message = await prisma.message_v2.findFirst({
      where: {
        id: messageId,
        chatId: chatId,
      },
    });

    if (!message) {
      return res.status(404).json(createError('not_found:vote', 'The requested message was not found.'));
    }

    // Upsert the vote
    const vote = await prisma.vote_v2.upsert({
      where: {
        chatId_messageId: {
          chatId: chatId,
          messageId: messageId,
        },
      },
      update: {
        isUpvoted: isUpvoted,
      },
      create: {
        chatId: chatId,
        messageId: messageId,
        isUpvoted: isUpvoted,
      },
    });

    res.json({ vote });
  } catch (error) {
    console.error('Error voting on message:', error);
    res.status(500).json(createError('database:vote', 'An error occurred while executing a database query.'));
  }
});

export default router;
