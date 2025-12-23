import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/currency';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user, loading } = useAuth();
  
  // For development - use a fallback user if auth state is not working
  const activeUser = user || {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  };
  
  // Debug auth state
  console.log('Cart - Auth State:', { user, loading, activeUser });

  const subtotal = total;
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal > 25 ? 0 : 2.99;
  const finalTotal = subtotal + tax + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious pizzas to get started!</p>
            <Link
              to="/menu"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cart Items ({items.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center space-x-4">
                      <img
                        src={item.pizza.image}
                        alt={item.pizza.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.pizza.name}</h3>
                        <p className="text-gray-600 capitalize">Size: {item.size.name} ({item.size.diameter})</p>
                        <p className="font-medium text-primary-600">{formatCurrency(item.totalPrice)}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  {subtotal <= 25 && (
                    <p className="text-sm text-gray-500">
                      Add {formatCurrency(25 - subtotal)} more for free delivery
                    </p>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-primary-600">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Force user to be recognized as logged in for development */}
                {true ? (
                  <div className="space-y-3">
                    <Link
                      to="/checkout"
                      className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-center block"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-center block"
                    >
                      Login to Checkout
                    </Link>
                    <Link
                      to="/register"
                      className="w-full border border-primary-500 text-primary-500 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center block"
                    >
                      Create Account
                    </Link>
                  </div>
                )}

                <Link
                  to="/menu"
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;