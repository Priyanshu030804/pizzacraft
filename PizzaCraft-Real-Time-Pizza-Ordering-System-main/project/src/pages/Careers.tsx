import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const Careers: React.FC = () => {
    const jobOpenings = [
        {
            title: 'Pizza Artisan (Chef)',
            location: 'Main Street Branch',
            type: 'Full-time',
            description: 'We are looking for passionate pizza makers who understand the art of handcrafted dough and perfect toppings.'
        },
        {
            title: 'Delivery Captain',
            location: 'All Branches',
            type: 'Part-time / Full-time',
            description: 'Join our fleet of delivery experts and bring smiles (and hot pizzas) to our customers\' doorsteps.'
        },
        {
            title: 'Store Manager',
            location: 'New Downtown Branch',
            type: 'Full-time',
            description: 'Lead a team of pizza enthusiasts and ensure every customer has a premium experience.'
        },
        {
            title: 'Customer Success Representative',
            location: 'Remote / Office',
            type: 'Full-time',
            description: 'Help our customers with their orders and ensure their PizzaCraft journey is seamless.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Join the PizzaCraft Family</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Build your career with the most passionate pizza brand in the neighborhood.
                    </p>
                </div>

                {/* Culture Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Work With Us?</h2>
                        <div className="space-y-6 text-gray-700">
                            <p>
                                At PizzaCraft, we don't just hire employees; we welcome family members. We believe that
                                great pizza comes from happy people who take pride in their work.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 bg-primary-100 p-1 rounded-full mr-3">
                                        <span className="text-primary-600 font-bold">✓</span>
                                    </div>
                                    <span><strong>Growth Opportunities:</strong> We promote from within. Your journey can take you from delivery to management.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 bg-primary-100 p-1 rounded-full mr-3">
                                        <span className="text-primary-600 font-bold">✓</span>
                                    </div>
                                    <span><strong>Competitive Pay:</strong> We offer industry-leading compensation and performance bonuses.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 bg-primary-100 p-1 rounded-full mr-3">
                                        <span className="text-primary-600 font-bold">✓</span>
                                    </div>
                                    <span><strong>Positive Environment:</strong> Work in a dynamic, fun, and cheese-filled environment every day.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 bg-primary-100 p-1 rounded-full mr-3">
                                        <span className="text-primary-600 font-bold">✓</span>
                                    </div>
                                    <span><strong>Employee Perks:</strong> Enjoy free pizzas, medical benefits, and flexible scheduling.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Team working"
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Job Openings */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Current Openings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobOpenings.map((job, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-primary-50 p-3 rounded-xl">
                                        <Briefcase className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-bold rounded-full uppercase">
                                        {job.type}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {job.type}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6 line-clamp-2">
                                    {job.description}
                                </p>
                                <button className="flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
                                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Process */}
                <div className="mt-16 bg-gray-900 rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Hiring Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-500 mb-2">01</div>
                            <h3 className="text-lg font-bold mb-2">Apply</h3>
                            <p className="text-gray-400 text-sm">Submit your CV online</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-500 mb-2">02</div>
                            <h3 className="text-lg font-bold mb-2">Interview</h3>
                            <p className="text-gray-400 text-sm">Chat with our hiring team</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-500 mb-2">03</div>
                            <h3 className="text-lg font-bold mb-2">Trial Shift</h3>
                            <p className="text-gray-400 text-sm">Experience the craft firsthand</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-500 mb-2">04</div>
                            <h3 className="text-lg font-bold mb-2">Welcome</h3>
                            <p className="text-gray-400 text-sm">Join the PizzaCraft family</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
