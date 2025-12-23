import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pizza, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useAppNavigation } from '../hooks/useAppNavigation';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { goHome, goToCart } = useAppNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      goHome();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
            <Pizza className="h-8 w-8 text-primary-600" />
            <span className="font-display font-bold text-xl text-gray-900">PizzaCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/menu" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Menu
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Orders
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Removed test order development button */}
            
            <button 
              onClick={goToCart} 
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  {user.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/menu"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={handleLinkClick}
              >
                Menu
              </Link>
              {user && (
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={handleLinkClick}
                >
                  Orders
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors mb-4"
                  onClick={handleLinkClick}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({itemCount})</span>
                </Link>

                {user ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                      onClick={handleLinkClick}
                    >
                      {user.firstName} (Profile)
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                      onClick={handleLinkClick}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-center"
                      onClick={handleLinkClick}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;