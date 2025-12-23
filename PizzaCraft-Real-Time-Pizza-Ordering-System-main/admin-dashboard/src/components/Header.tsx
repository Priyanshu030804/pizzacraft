import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Pizza, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Orders', key: 'orders' },
    { name: 'Customers', key: 'customers' },
    { name: 'Feedback', key: 'feedback' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Pizza className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">PizzaCraft</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.key
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.firstName} {user?.lastName}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
