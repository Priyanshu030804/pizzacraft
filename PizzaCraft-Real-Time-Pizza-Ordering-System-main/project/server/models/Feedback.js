import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: false
        },
        category: {
            type: String,
            enum: ['Food', 'Service', 'App', 'Delivery', 'Other'],
            default: 'Other'
        },
        is_public: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
