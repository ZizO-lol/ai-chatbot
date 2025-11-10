import express, { Response } from 'express';
import { prisma } from '../index';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Helper to create error response
const createError = (code: string, message: string) => ({ code, message });

// Get documents for authenticated user
router.get('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.query;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:document', 'You need to sign in to view this document. Please sign in and try again.'));
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    // Get all versions of the document
    const documents = await prisma.document.findMany({
      where: {
        id: id,
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (documents.length === 0) {
      return res.status(404).json(createError('not_found:document', 'The requested document was not found. Please check the document ID and try again.'));
    }

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json(createError('database:document', 'An error occurred while executing a database query.'));
  }
});

// Create or update a document
router.post('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, title, content, kind } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:document', 'You need to sign in to view this document. Please sign in and try again.'));
    }

    if (!title) {
      return res.status(400).json(createError('bad_request:document', 'The request to create or update the document was invalid. Please check your input and try again.'));
    }

    // If id is provided, check if document exists and belongs to user
    if (id) {
      const existingDocuments = await prisma.document.findMany({
        where: {
          id: id,
        },
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingDocuments.length > 0 && existingDocuments[0].userId !== userId) {
        return res.status(403).json(createError('forbidden:document', 'This document belongs to another user. Please check the document ID and try again.'));
      }
    }

    // Create new version of document
    const document = await prisma.document.create({
      data: {
        id: id,
        title: title,
        content: content || null,
        kind: kind || 'text',
        userId: userId,
      },
    });

    res.json([document]);
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json(createError('database:document', 'An error occurred while executing a database query.'));
  }
});

// Delete a document version
router.delete('/', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id, timestamp } = req.query;

    if (!userId) {
      return res.status(401).json(createError('unauthorized:document', 'You need to sign in to view this document. Please sign in and try again.'));
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    if (!timestamp || typeof timestamp !== 'string') {
      return res.status(400).json(createError('bad_request:api', 'The request couldn\'t be processed. Please check your input and try again.'));
    }

    // Check if document exists and belongs to user
    const document = await prisma.document.findFirst({
      where: {
        id: id,
        createdAt: new Date(timestamp),
        userId: userId,
      },
    });

    if (!document) {
      return res.status(404).json(createError('not_found:document', 'The requested document was not found. Please check the document ID and try again.'));
    }

    // Delete the specific version
    await prisma.document.delete({
      where: {
        id_createdAt: {
          id: id,
          createdAt: new Date(timestamp),
        },
      },
    });

    // Return remaining versions
    const remainingDocuments = await prisma.document.findMany({
      where: {
        id: id,
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(remainingDocuments);
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json(createError('database:document', 'An error occurred while executing a database query.'));
  }
});

export default router;
