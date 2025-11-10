import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Document route not yet implemented' });
});

router.post('/', (req, res) => {
  res.status(501).json({ error: 'Document route not yet implemented' });
});

export default router;
