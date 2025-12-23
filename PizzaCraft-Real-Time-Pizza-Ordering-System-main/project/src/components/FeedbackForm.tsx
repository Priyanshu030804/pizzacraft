import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

interface FeedbackFormProps {
    orderId?: string;
    category?: 'Food' | 'Service' | 'App' | 'Delivery' | 'Other';
    onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ orderId, category = 'Other', onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    rating,
                    comment,
                    order_id: orderId,
                    category,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setIsSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">Your feedback helps us provide better service.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Give us your feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="Your email"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hover || rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                        required
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us about your experience..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            <span>Submit Feedback</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
