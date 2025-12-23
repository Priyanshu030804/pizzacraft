import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Filter, User, Calendar, ExternalLink } from 'lucide-react';
import { apiGet } from '../services/api';

const Feedback: React.FC = () => {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const url = `/api/feedback?rating=${filterRating === 'all' ? '' : filterRating}&category=${filterCategory === 'all' ? '' : filterCategory}`;
            const data = await apiGet(url);
            setFeedback(data || []);
        } catch (err) {
            console.error('Failed to load feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [filterRating, filterCategory]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRatingStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (loading && feedback.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="mr-2 h-6 w-6 text-primary-600" />
                    User Feedback
                </h1>

                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="all">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Service">Service</option>
                        <option value="App">App</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {feedback.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900">No feedback found</h2>
                    <p className="text-gray-500">Try changing your filters or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedback.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {getRatingStars(item.rating)}
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-gray-700 italic text-sm leading-relaxed mb-4">
                                    "{item.comment}"
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(item.created_at)}
                                </div>
                                {item.order_id && (
                                    <div className="flex items-center text-primary-600 font-medium">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Order #{(item.order_id.order_number || item.order_id).toString().slice(-6)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feedback;
