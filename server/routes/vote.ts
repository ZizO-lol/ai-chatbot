import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  res.status(501).json({ error: 'Vote route not yet implemented' });
});

export default router;
