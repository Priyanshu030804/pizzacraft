import express from 'express';
const router = express.Router();

router.all('*', (_req, res) => {
  res.status(501).json({ error: 'Orders (new) endpoints not yet migrated to MongoDB' });
});

export default router;
