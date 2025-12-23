import React from 'react';
import { Star, Plus } from 'lucide-react';
import { Pizza } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/currency';

interface PizzaCardProps {
  pizza: Pizza;
  onViewDetails: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onViewDetails }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Quick add clicked for pizza:', pizza.name);
    console.log('Pizza sizes:', pizza.sizes);
    
    const mediumSize = pizza.sizes.find(size => size.name === 'medium') || pizza.sizes[1];
    console.log('Selected size:', mediumSize);
    
    if (mediumSize) {
      addItem(pizza, mediumSize, 1);
    } else {
      console.error('No medium size found for pizza:', pizza.name);
    }
  };

  const INGREDIENT_MODIFIER = 10;
  const SIZE_EXTRA: Record<string, number> = {
    small: 75,
    medium: 85,
    large: 95,
    xl: 100
  };
  const medium = pizza.sizes.find(s => s.name === 'medium') || pizza.sizes[1];
  const sizeKey = (medium?.name || '').toLowerCase();
  const sizeExtra = SIZE_EXTRA[sizeKey] ?? SIZE_EXTRA['medium'];
  const computed = pizza.basePrice * (medium?.priceMultiplier || 1) + (pizza.ingredients?.length || 0) * INGREDIENT_MODIFIER + sizeExtra;
  const displayUnit = Math.round(computed * 100) / 100;

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onViewDetails(pizza)}
    >
      <div className="relative">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={handleQuickAdd}
            className="bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
            title="Quick add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {!pizza.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{pizza.name}</h3>
          <span className="font-bold text-primary-600">{formatCurrency(displayUnit)}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pizza.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{pizza.rating}</span>
            <span className="text-sm text-gray-500">({pizza.reviewCount})</span>
          </div>

          <div className="flex items-center space-x-1">
            {pizza.category === 'vegetarian' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Veggie
              </span>
            )}
            {pizza.category === 'meat' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Meat
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;