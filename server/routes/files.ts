import express from 'express';
const router = express.Router();

router.post('/upload', (req, res) => {
  res.status(501).json({ error: 'File upload route not yet implemented' });
});

export default router;
