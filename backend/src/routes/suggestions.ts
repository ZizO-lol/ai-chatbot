import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get suggestions by documentId
router.get('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { documentId } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!documentId || typeof documentId !== 'string') {
      return res.status(400).json({ error: 'documentId query parameter is required' });
    }

    // Verify the document belongs to the user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: userId,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const suggestions = await prisma.suggestion.findMany({
      where: {
        documentId: documentId,
        documentCreatedAt: document.createdAt,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

export default router;
