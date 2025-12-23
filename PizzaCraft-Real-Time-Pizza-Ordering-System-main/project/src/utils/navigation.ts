import { NavigateFunction } from 'react-router-dom';

// Removed Supabase integration; this file now only handles navigation helpers.
// Any previous imports expecting `supabase` should be updated to use backend services instead.

// Navigation helper to ensure consistent routing
export class NavigationHelper {
  private navigate: NavigateFunction;

  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // Safe navigation that preserves authentication state
  goTo(path: string, options?: { replace?: boolean; state?: unknown }) {
    try {
      this.navigate(path, options);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = path;
    }
  }

  // Navigation with authentication check
  goToProtected(path: string, isAuthenticated: boolean, options?: { replace?: boolean; state?: unknown }) {
    if (!isAuthenticated) {
      this.goTo('/login', { 
        replace: true, 
        state: { from: path, message: 'Please login to access this page' } 
      });
      return;
    }
    this.goTo(path, options);
  }

  // Common navigation shortcuts
  goHome() {
    this.goTo('/');
  }

  goToMenu() {
    this.goTo('/menu');
  }

  goToCart() {
    this.goTo('/cart');
  }

  goToOrders(isAuthenticated: boolean) {
    this.goToProtected('/orders', isAuthenticated);
  }

  goToProfile(isAuthenticated: boolean) {
    this.goToProtected('/profile', isAuthenticated);
  }

  goToCheckout(isAuthenticated: boolean) {
    this.goToProtected('/checkout', isAuthenticated);
  }

  goToLogin() {
    this.goTo('/login');
  }

  goToRegister() {
    this.goTo('/register');
  }

  goToAdmin(isAuthenticated: boolean, isAdmin: boolean) {
    if (!isAuthenticated) {
      this.goTo('/login', { 
        replace: true, 
        state: { from: '/admin', message: 'Please login to access admin panel' } 
      });
      return;
    }
    if (!isAdmin) {
      this.goTo('/', { 
        replace: true, 
        state: { message: 'Access denied. Admin privileges required.' } 
      });
      return;
    }
    this.goTo('/admin');
  }
}

// Route definitions for consistent navigation
export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  CART: '/cart',
  LOGIN: '/login',
  REGISTER: '/register',
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
  ADMIN: {
    DASHBOARD: '/admin',
    ORDERS: '/admin/orders',
    MENU: '/admin/menu',
    USERS: '/admin/users',
    INVENTORY: '/admin/inventory',
  }
} as const;

export type RouteKey = keyof typeof ROUTES;
