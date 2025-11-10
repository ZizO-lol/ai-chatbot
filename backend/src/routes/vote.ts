import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Vote on a message (upvote/downvote)
router.post('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, messageId, isUpvoted } = req.body;

    if (!chatId || !messageId || typeof isUpvoted !== 'boolean') {
      return res.status(400).json({ error: 'chatId, messageId, and isUpvoted are required' });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify the chat belongs to the user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: userId,
      },
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Verify the message exists in the chat
    const message = await prisma.message_v2.findFirst({
      where: {
        id: messageId,
        chatId: chatId,
      },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
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
    res.status(500).json({ error: 'Failed to vote on message' });
  }
});

export default router;
