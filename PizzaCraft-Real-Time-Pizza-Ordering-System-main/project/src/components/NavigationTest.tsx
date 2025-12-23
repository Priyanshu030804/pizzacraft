import React from 'react';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAuth } from '../contexts/AuthContext';

const NavigationTest: React.FC = () => {
  const { nav, routes, isAuthenticated, isAdmin } = useAppNavigation();
  const { user } = useAuth();

  const testRoutes = [
    { name: 'Home', path: routes.HOME, action: () => nav.goHome(), public: true },
    { name: 'Menu', path: routes.MENU, action: () => nav.goToMenu(), public: true },
    { name: 'Cart', path: routes.CART, action: () => nav.goToCart(), public: true },
    { name: 'Login', path: routes.LOGIN, action: () => nav.goToLogin(), public: true },
    { name: 'Register', path: routes.REGISTER, action: () => nav.goToRegister(), public: true },
    { name: 'Orders', path: routes.ORDERS, action: () => nav.goTo(routes.ORDERS), public: true },
    { name: 'Profile', path: routes.PROFILE, action: () => nav.goTo(routes.PROFILE), public: true },
    { name: 'Checkout', path: routes.CHECKOUT, action: () => nav.goTo(routes.CHECKOUT), public: true },
    { name: 'Admin Dashboard', path: routes.ADMIN.DASHBOARD, action: () => nav.goTo(routes.ADMIN.DASHBOARD), public: true },
    { name: 'Admin Orders', path: routes.ADMIN.ORDERS, action: () => nav.goTo(routes.ADMIN.ORDERS), public: true },
    { name: 'Admin Menu', path: routes.ADMIN.MENU, action: () => nav.goTo(routes.ADMIN.MENU), public: true },
    { name: 'Admin Users', path: routes.ADMIN.USERS, action: () => nav.goTo(routes.ADMIN.USERS), public: true },
    { name: 'Admin Inventory', path: routes.ADMIN.INVENTORY, action: () => nav.goTo(routes.ADMIN.INVENTORY), public: true },
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-lg font-semibold mb-3">Navigation Test</h3>
      
      <div className="mb-3 text-sm">
        <p>User: {user ? `${user.firstName} (${user.role})` : 'Not logged in'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {testRoutes.map((route) => (
          <button
            key={route.name}
            onClick={route.action}
            className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors bg-blue-500 text-white hover:bg-blue-600"
          >
            {route.name}
            {route.public && ' 🌐'}
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          🌐 = Public access - No login required
        </p>
      </div>
    </div>
  );
};

export default NavigationTest;
