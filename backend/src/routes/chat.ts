import express from 'express';
const router = express.Router();

// Placeholder routes - to be implemented
router.post('/', (req, res) => {
  res.status(501).json({ error: 'Chat route not yet implemented' });
});

router.get('/:id/stream', (req, res) => {
  res.status(501).json({ error: 'Stream route not yet implemented' });
});

export default router;
