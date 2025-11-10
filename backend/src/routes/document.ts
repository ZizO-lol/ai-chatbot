import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get documents for authenticated user
router.get('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // If id is provided, get specific document
    if (id && typeof id === 'string') {
      const document = await prisma.document.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.json({ document });
    }

    // Otherwise, get all documents for user
    const documents = await prisma.document.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Create or update a document
router.post('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, title, content, kind } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    // If id is provided, try to update existing document
    if (id) {
      const existingDocument = await prisma.document.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingDocument) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const updatedDocument = await prisma.document.update({
        where: {
          id_createdAt: {
            id: id,
            createdAt: existingDocument.createdAt,
          },
        },
        data: {
          title: title,
          content: content !== undefined ? content : existingDocument.content,
          kind: kind !== undefined ? kind : existingDocument.kind,
        },
      });

      return res.json({ document: updatedDocument });
    }

    // Create new document
    const document = await prisma.document.create({
      data: {
        title: title,
        content: content || null,
        kind: kind || 'text',
        userId: userId,
      },
    });

    res.status(201).json({ document });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ error: 'Failed to save document' });
  }
});

export default router;
