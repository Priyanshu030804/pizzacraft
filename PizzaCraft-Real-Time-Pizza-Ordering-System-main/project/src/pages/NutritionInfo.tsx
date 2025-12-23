import React from 'react';
import { Leaf, AlertCircle } from 'lucide-react';

const NutritionInfo: React.FC = () => {
    const pizzaNutrition = [
        {
            name: 'Margherita',
            size: 'Medium (12")',
            calories: 250,
            protein: '12g',
            carbs: '32g',
            fat: '8g',
            sodium: '580mg'
        },
        {
            name: 'Pepperoni',
            size: 'Medium (12")',
            calories: 290,
            protein: '14g',
            carbs: '33g',
            fat: '11g',
            sodium: '680mg'
        },
        {
            name: 'Veggie Supreme',
            size: 'Medium (12")',
            calories: 230,
            protein: '10g',
            carbs: '35g',
            fat: '6g',
            sodium: '520mg'
        },
        {
            name: 'BBQ Chicken',
            size: 'Medium (12")',
            calories: 280,
            protein: '16g',
            carbs: '34g',
            fat: '9g',
            sodium: '640mg'
        },
        {
            name: 'Hawaiian',
            size: 'Medium (12")',
            calories: 260,
            protein: '13g',
            carbs: '36g',
            fat: '7g',
            sodium: '600mg'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Nutrition Information</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Making informed choices about your favorite pizzas
                    </p>
                </div>

                {/* Allergen Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg">
                    <div className="flex items-start">
                        <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Allergen Information</h3>
                            <p className="text-yellow-800">
                                Our pizzas may contain or come into contact with common allergens including wheat, milk,
                                eggs, soy, and tree nuts. If you have specific dietary restrictions or allergies, please
                                contact us before ordering.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fresh Ingredients */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <Leaf className="h-8 w-8 text-green-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Fresh Ingredients</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>100% real mozzarella cheese</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>Fresh vegetables delivered daily</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>Dough made fresh every morning</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>No artificial preservatives</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dietary Options</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>Vegetarian options available</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>Gluten-free crust available</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>Vegan cheese option</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">✓</span>
                                    <span>Low-calorie options</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nutrition Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 bg-primary-600">
                        <h2 className="text-2xl font-bold text-white">Nutritional Values (Per Slice)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pizza Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Calories
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Protein
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Carbs
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sodium
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pizzaNutrition.map((pizza, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {pizza.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pizza.size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {pizza.calories}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pizza.protein}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pizza.carbs}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pizza.fat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pizza.sodium}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-gray-50 text-sm text-gray-600">
                        <p>* Nutritional values are approximate and may vary based on specific ingredients and preparation methods.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionInfo;
