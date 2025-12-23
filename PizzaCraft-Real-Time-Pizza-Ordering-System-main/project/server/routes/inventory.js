import express from 'express';
const router = express.Router();

// TODO: Migrate inventory endpoints to MongoDB.
router.all('*', (_req, res) => {
  res.status(501).json({ error: 'Inventory endpoints not yet migrated to MongoDB' });
});

export default router;