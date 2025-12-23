import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAuth } from '../contexts/AuthContext';

const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { nav, routes, isAuthenticated, isAdmin } = useAppNavigation();
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const menuItems = [
    { name: 'Home', action: () => nav.goHome(), public: true },
    { name: 'Menu', action: () => nav.goToMenu(), public: true },
    { name: 'Cart', action: () => nav.goToCart(), public: true },
    { name: 'Orders', action: () => nav.goTo(routes.ORDERS), requiresAuth: true },
    { name: 'Profile', action: () => nav.goTo(routes.PROFILE), requiresAuth: true },
    { name: 'Checkout', action: () => nav.goTo(routes.CHECKOUT), public: true },
  ];

  const adminItems = [
    { name: 'Admin Dashboard', action: () => nav.goTo(routes.ADMIN.DASHBOARD) },
    { name: 'Admin Orders', action: () => nav.goTo(routes.ADMIN.ORDERS) },
    { name: 'Admin Menu', action: () => nav.goTo(routes.ADMIN.MENU) },
    { name: 'Admin Users', action: () => nav.goTo(routes.ADMIN.USERS) },
    { name: 'Admin Inventory', action: () => nav.goTo(routes.ADMIN.INVENTORY) },
  ];

  const authItems = [
    { name: 'Login', action: () => nav.goToLogin(), showWhenLoggedOut: true },
    { name: 'Register', action: () => nav.goToRegister(), showWhenLoggedOut: true },
  ];

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Burger Menu Button */}
      <button
        onClick={toggleMenu}
        className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors border border-gray-200"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 -z-10" onClick={toggleMenu} />
      )}

      {/* Menu Panel */}
      <div className={`absolute top-16 left-0 bg-white shadow-xl rounded-lg border border-gray-200 min-w-64 transform transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-4">
          {/* User Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              {user ? `Welcome, ${user.firstName}` : 'Not logged in'}
            </p>
            <p className="text-xs text-gray-500">
              {user ? `Role: ${user.role}` : 'Please login for full access'}
            </p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Navigation</h3>
            {menuItems.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.action)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Admin</h3>
              <div className="space-y-2">
                {adminItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.action)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auth Section */}
          {!isAuthenticated && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Account</h3>
              <div className="space-y-2">
                {authItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.action)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
