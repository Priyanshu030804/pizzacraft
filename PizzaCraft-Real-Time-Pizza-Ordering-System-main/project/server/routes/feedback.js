import express from 'express';
import Feedback from '../models/Feedback.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, rating, comment, order_id, category } = req.body;

        // Validate required fields
        if (!name || !email || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const feedbackData = {
            name,
            email,
            rating: parseInt(rating),
            comment,
            category: category || 'Other',
            user: req.user ? req.user.id : null,
            order_id: order_id || null
        };

        const feedback = await Feedback.create(feedbackData);

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get all feedback (Admin only)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
    try {
        const { rating, category, limit = 50 } = req.query;

        const filter = {};
        if (rating) filter.rating = parseInt(rating);
        if (category) filter.category = category;

        const feedback = await Feedback.find(filter)
            .sort({ created_at: -1 })
            .limit(parseInt(limit))
            .populate({ path: 'user', select: 'first_name last_name email' })
            .populate({ path: 'order_id', select: 'order_number total_amount' })
            .lean();

        res.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// Get feedback for a specific order
router.get('/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const feedback = await Feedback.findOne({ order_id: orderId }).lean();

        if (!feedback) {
            return res.status(404).json({ error: 'No feedback found for this order' });
        }

        res.json(feedback);
    } catch (error) {
        console.error('Error fetching order feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

export default router;
