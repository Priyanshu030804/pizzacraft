import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { mockPizzas } from '../data/mockData';
import { Pizza } from '../types';
import PizzaCard from '../components/PizzaCard';
import PizzaModal from '../components/PizzaModal';

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);

  const categories = [
    { id: 'all', name: 'All Pizzas' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'meat', name: 'Meat Lovers' },
    { id: 'specialty', name: 'Specialty' },
  ];

  const filteredPizzas = mockPizzas.filter(pizza => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pizza.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600">
            Discover our handcrafted pizzas made with the finest ingredients
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search pizzas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPizzas.length} {filteredPizzas.length === 1 ? 'pizza' : 'pizzas'}
          </p>
        </div>

        {/* Pizza Grid */}
        {filteredPizzas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onViewDetails={setSelectedPizza}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pizzas found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>

      {/* Pizza Modal */}
      {selectedPizza && (
        <PizzaModal
          pizza={selectedPizza}
          onClose={() => setSelectedPizza(null)}
        />
      )}
    </div>
  );
};

export default Menu;