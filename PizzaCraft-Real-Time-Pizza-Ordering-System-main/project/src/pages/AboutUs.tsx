import React from 'react';
import { Pizza, Heart, Award, Users } from 'lucide-react';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">About PizzaCraft</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Crafting authentic, delicious pizzas with passion and fresh ingredients since 2020
                    </p>
                </div>

                {/* Hero Image */}
                <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                        alt="Fresh Pizza"
                        className="w-full h-96 object-cover"
                    />
                </div>

                {/* Our Story */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="mb-4">
                            PizzaCraft was born from a simple dream: to bring authentic, handcrafted pizzas to our community.
                            What started as a small family kitchen in 2020 has grown into your neighborhood's favorite pizza destination.
                        </p>
                        <p className="mb-4">
                            We believe that great pizza starts with great ingredients. That's why we source only the freshest
                            vegetables, premium meats, and authentic Italian cheeses. Our dough is made fresh daily using
                            traditional methods, and our signature sauce is crafted from vine-ripened tomatoes.
                        </p>
                        <p>
                            Every pizza that leaves our kitchen is a testament to our commitment to quality, taste, and
                            customer satisfaction. We're not just making pizza – we're creating experiences, one slice at a time.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <Pizza className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
                        <p className="text-gray-600">
                            We never compromise on ingredients or preparation methods
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <Heart className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Made with Love</h3>
                        <p className="text-gray-600">
                            Every pizza is handcrafted with care and attention to detail
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <Award className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Award Winning</h3>
                        <p className="text-gray-600">
                            Recognized for excellence in taste and service
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <Users className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Community Focused</h3>
                        <p className="text-gray-600">
                            Proud to serve and support our local community
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Meet Our Team</h2>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                        Our passionate team of pizza artisans, delivery experts, and customer service professionals
                        work together to ensure every order exceeds your expectations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary-600">MC</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Master Chef</h3>
                            <p className="text-gray-600">Head Pizza Artisan</p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary-600">OM</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Operations Manager</h3>
                            <p className="text-gray-600">Ensuring Quality Service</p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary-600">CS</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Customer Success</h3>
                            <p className="text-gray-600">Your Satisfaction Expert</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
