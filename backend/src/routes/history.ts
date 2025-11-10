import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Helper to create error response
const createError = (code: string, message: string) => ({ code, message });

// Get chat history for authenticated user
router.get('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:history', 'You need to sign in before continuing.'));
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        visibility: true,
      },
    });

    res.json({ chats });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json(createError('database:history', 'An error occurred while executing a database query.'));
  }
});

export default router;
