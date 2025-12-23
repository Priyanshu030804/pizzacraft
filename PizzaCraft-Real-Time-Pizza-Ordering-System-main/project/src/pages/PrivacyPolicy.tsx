import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-primary-600 p-12 text-white text-center">
                        <Shield className="h-16 w-16 mx-auto mb-4 opacity-80" />
                        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
                        <p className="text-primary-100">Last Updated: December 2025</p>
                    </div>

                    <div className="p-12 space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <div className="flex items-center mb-4">
                                <Lock className="h-6 w-6 text-primary-600 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900 underline decoration-primary-200">Introduction</h2>
                            </div>
                            <p>
                                At PizzaCraft, we value your privacy. This policy explains how we collect, use, and protect your information
                                when you use our website, mobile application, and ordering services.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center mb-4">
                                <Eye className="h-6 w-6 text-primary-600 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900 underline decoration-primary-200">Information We Collect</h2>
                            </div>
                            <p className="mb-4">We collect information that you provide directly to us:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Personal identifiers (name, email address, phone number).</li>
                                <li>Delivery address and location data.</li>
                                <li>Payment information (processed securely through third-party providers).</li>
                                <li>Order history and favorites.</li>
                                <li>Feedback and communications you send to us.</li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center mb-4">
                                <FileText className="h-6 w-6 text-primary-600 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900 underline decoration-primary-200">How We Use Your Data</h2>
                            </div>
                            <p className="mb-4">Your data helps us serve you better by:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Processing and delivering your orders.</li>
                                <li>Authenticating your account and maintaining security.</li>
                                <li>Providing customer support and resolving issues.</li>
                                <li>Sending order updates and promotional offers (if consented).</li>
                                <li>Improving our menu and service based on your feedback.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 underline decoration-primary-200">Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. All sensitive communications
                                between your browser and our servers are encrypted via SSL/TLS. We do not store full credit card
                                details on our servers; payments are handled by certified payment processors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 underline decoration-primary-200">Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can manage most
                                of your data through your profile settings. For complete data deletion requests, please contact
                                us at <span className="font-bold text-primary-600">privacy@pizzacraft.com</span>.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                If you have any questions about this Privacy Policy, please contact our Data Protection Officer.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
