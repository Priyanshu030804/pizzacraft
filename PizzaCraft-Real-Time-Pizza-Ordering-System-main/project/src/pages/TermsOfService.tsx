import React from 'react';
import { FileText, Gavel, AlertTriangle, AlertCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-900 p-12 text-white text-center">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-primary-500" />
                        <h1 className="text-4xl font-extrabold mb-2 text-white">Terms of Service</h1>
                        <p className="text-gray-400">Effective Date: December 23, 2025</p>
                    </div>

                    <div className="p-12 space-y-10 text-gray-700">
                        <section>
                            <div className="flex items-center mb-4">
                                <Gavel className="h-6 w-6 text-primary-600 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                            </div>
                            <p className="leading-relaxed">
                                By accessing or using the PizzaCraft platform, you agree to be bound by these Terms of Service
                                and all applicable laws and regulations. If you do not agree with any of these terms, you are
                                prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-primary-600 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900">2. Order and Delivery</h2>
                            </div>
                            <div className="space-y-4 leading-relaxed">
                                <p>
                                    Orders are subject to availability and territory restrictions. We reserve the right to
                                    decline any order at our discretion.
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Delivery times are estimates and not guaranteed.</li>
                                    <li>You must provide accurate delivery information to ensure successful fulfillment.</li>
                                    <li>Alcoholic beverages (if available) can only be ordered by persons of legal drinking age.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center mb-4">
                                <AlertCircle className="h-6 w-6 text-primary-600 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900">3. Pricing and Payment</h2>
                            </div>
                            <p className="leading-relaxed">
                                All prices are shown in local currency and include applicable taxes unless stated otherwise.
                                We reserve the right to change prices without notice. Payments must be made in full at the
                                time of ordering or upon delivery (where permitted).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
                            <p className="leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials and for
                                all activities that occur under your account. You must notify us immediately of any
                                unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <p className="leading-relaxed">
                                The content, logo, and design of PizzaCraft are the exclusive property of PizzaCraft. You
                                may not reproduce, modify, or distribute any part of this platform without our express
                                written permission.
                            </p>
                        </section>

                        <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                            <p className="text-sm leading-relaxed text-gray-600 italic">
                                PizzaCraft shall not be liable for any indirect, incidental, or consequential damages
                                resulting from the use or inability to use the platform. Our total liability shall not
                                exceed the amount paid by you for the specific order giving rise to the claim.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                PizzaCraft reserves the right to modify these terms at any time. Your continued use of the
                                platform indicates your acceptance of the new terms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
