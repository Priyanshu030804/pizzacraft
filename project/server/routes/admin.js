import express from 'express';
const router = express.Router();

// TODO: Migrate admin endpoints to MongoDB.
router.all('*', (_req, res) => {
  res.status(501).json({ error: 'Admin endpoints not yet migrated to MongoDB' });
});

export default router;