import express from 'express';
import Pizza from '../models/Pizza.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all pizzas (public)
router.get('/pizzas', async (req, res) => {
  try {
    const { category, available, search } = req.query;
    
    let mongoQuery = {};
    const sort = { name: 1 };

    // Apply filters
    if (category && category !== 'all') {
      mongoQuery.category = category;
    }

    if (available !== undefined) {
      mongoQuery.available = available === 'true';
    }

    if (search) {
      mongoQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pizzas = await Pizza.find(mongoQuery).sort(sort).lean();
    res.json(pizzas);
  } catch (error) {
    console.error('Menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single pizza
router.get('/pizzas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findById(id).lean();
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    res.json(pizza);
  } catch (error) {
    console.error('Get pizza error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create pizza (admin only)
router.post('/pizzas', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      basePrice,
      category,
      ingredients,
      available = true
    } = req.body;

    // Validation
    if (!name || !description || !basePrice || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const defaultSizes = [
      { name: 'small', diameter: '10"', price_multiplier: 1 },
      { name: 'medium', diameter: '12"', price_multiplier: 1.3 },
      { name: 'large', diameter: '14"', price_multiplier: 1.6 },
      { name: 'xl', diameter: '16"', price_multiplier: 2 }
    ];

    const pizza = await Pizza.create({
      name,
      description,
      image,
      base_price: basePrice,
      category,
      ingredients: ingredients || [],
      available,
      rating: 0,
      review_count: 0,
      pizza_sizes: defaultSizes
    });

    // Emit to connected clients
    req.io.emit('menu-updated', { action: 'pizza-created', pizza });

    res.status(201).json(pizza);
  } catch (error) {
    console.error('Create pizza error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pizza (admin only)
router.put('/pizzas/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove null/undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== null && value !== undefined)
    );

    const pizza = await Pizza.findByIdAndUpdate(
      id,
      { $set: cleanUpdates },
      { new: true }
    ).lean();

    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    // Emit to connected clients
    req.io.emit('menu-updated', { action: 'pizza-updated', pizza });

    res.json(pizza);
  } catch (error) {
    console.error('Update pizza error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete pizza (admin only)
router.delete('/pizzas/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findByIdAndDelete(id).lean();
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    // Emit to connected clients
    req.io.emit('menu-updated', { action: 'pizza-deleted', pizzaId: id });

    res.json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    console.error('Delete pizza error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Pizza.distinct('category', { category: { $ne: null } });
    const uniqueCategories = categories;
    res.json(uniqueCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;