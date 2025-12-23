import express from 'express';
const router = express.Router();

// TODO: Migrate payment endpoints to MongoDB.
router.all('*', (_req, res) => {
  res.status(501).json({ error: 'Payment endpoints not yet migrated to MongoDB' });
});

export default router;
