import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Helper to create error response
const createError = (code: string, message: string) => ({ code, message });

// Get suggestions by documentId
router.get('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { documentId } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:suggestions', 'You need to sign in before continuing.'));
    }

    if (!documentId || typeof documentId !== 'string') {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    // Verify the document belongs to the user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: userId,
      },
    });

    if (!document) {
      return res.status(404).json(createError('not_found:suggestions', 'The requested document was not found.'));
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
    res.status(500).json(createError('database:suggestions', 'An error occurred while executing a database query.'));
  }
});

export default router;
