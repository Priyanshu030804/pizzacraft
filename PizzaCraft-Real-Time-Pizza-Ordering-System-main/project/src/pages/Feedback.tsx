import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import { MessageSquare, Star, Smile } from 'lucide-react';

const Feedback: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center">
                        <MessageSquare className="mr-3 h-10 w-10 text-primary-600" />
                        We Value Your Feedback
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your reviews help us improve our recipes and services. Let us know how we're doing!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <FeedbackForm />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="text-xl font-bold mb-3 flex items-center">
                                <Star className="mr-2 h-6 w-6 text-yellow-400 fill-current" />
                                Our Quality
                            </h3>
                            <p className="text-primary-100 text-sm">
                                We use only the freshest ingredients and traditional baking methods to ensure every pizza is perfect.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <Smile className="mr-2 h-6 w-6 text-primary-600" />
                                Customer First
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Our team is dedicated to providing the best delivery experience. If something wasn't right, please tell us.
                            </p>
                        </div>

                        <div className="p-4">
                            <img
                                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                                alt="Delicious Pizza"
                                className="rounded-2xl shadow-md w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
