import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'History route not yet implemented' });
});

export default router;
