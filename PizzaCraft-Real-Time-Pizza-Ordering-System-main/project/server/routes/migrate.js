import express from 'express';
const router = express.Router();

// TODO: Implement data migration helpers for MongoDB if needed.
router.all('*', (_req, res) => {
  res.status(501).json({ error: 'Migration endpoints not available (Supabase removed)' });
});

export default router;
