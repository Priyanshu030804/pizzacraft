import { supabase } from '../lib/supabase';
import { authService } from './auth';
import type { User } from '../types';

export class SessionManager {
  private static instance: SessionManager;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Initialize session monitoring
  startSessionMonitoring() {
    // Update last activity on user interaction
    this.trackUserActivity();
    
    // Check session validity every 5 minutes
    this.sessionCheckInterval = setInterval(() => {
      this.validateSession();
    }, 5 * 60 * 1000);

    console.log('Session monitoring started');
  }

  stopSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
    console.log('Session monitoring stopped');
  }

  private trackUserActivity() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  private async validateSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        return false;
      }

      if (!session) {
        console.log('No active session found');
        return false;
      }

      // Check if session is expired
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      
      if (now >= expiresAt) {
        console.log('Session expired, attempting refresh');
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !data.session) {
          console.error('Session refresh failed:', refreshError);
          this.handleSessionExpired();
          return false;
        }
        
        console.log('Session refreshed successfully');
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  private handleSessionExpired() {
    // Clear any stored session data
    localStorage.removeItem('pizzacraft.auth.token');
    
    // Redirect to login if on a protected route
    const currentPath = window.location.pathname;
    const protectedRoutes = ['/checkout', '/orders', '/profile', '/admin'];
    
    if (protectedRoutes.some(route => currentPath.startsWith(route))) {
      window.location.href = '/login?expired=true';
    }
  }

  // Force session refresh
  async forceRefreshSession(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error('Force refresh failed:', error);
        return null;
      }

      const user = await authService.getCurrentUser();
      console.log('Session force refreshed for user:', user?.email);
      return user;
    } catch (error) {
      console.error('Force refresh error:', error);
      return null;
    }
  }

  // Check if user has been inactive for too long
  isUserInactive(inactiveThreshold: number = 30 * 60 * 1000): boolean {
    return Date.now() - this.lastActivity > inactiveThreshold;
  }

  // Get session info
  async getSessionInfo() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;

    return {
      user: session.user,
      expiresAt: session.expires_at,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      isExpired: session.expires_at ? Date.now() / 1000 >= session.expires_at : true
    };
  }
}

export const sessionManager = SessionManager.getInstance();
