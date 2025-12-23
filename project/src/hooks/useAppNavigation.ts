import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NavigationHelper, ROUTES } from '../utils/navigation';
import { useMemo } from 'react';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const navigationHelper = useMemo(() => new NavigationHelper(navigate), [navigate]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    // Navigation helper instance
    nav: navigationHelper,
    
    // Route constants
    routes: ROUTES,
    
    // Auth-aware navigation methods
    goToOrders: () => navigationHelper.goToOrders(isAuthenticated),
    goToProfile: () => navigationHelper.goToProfile(isAuthenticated),
    goToCheckout: () => navigationHelper.goToCheckout(isAuthenticated),
    goToAdmin: () => navigationHelper.goToAdmin(isAuthenticated, isAdmin),
    
    // Simple navigation methods
    goHome: () => navigationHelper.goHome(),
    goToMenu: () => navigationHelper.goToMenu(),
    goToCart: () => navigationHelper.goToCart(),
    goToLogin: () => navigationHelper.goToLogin(),
    goToRegister: () => navigationHelper.goToRegister(),
    
    // Auth state
    isAuthenticated,
    isAdmin,
    user
  };
};
