import { Order } from '../types';
import { websiteConnectionService } from './websiteConnection';

// This service will communicate with the main pizza website's localStorage
// to sync order data in real-time
export class OrderSyncService {
  private static instance: OrderSyncService;
  private listeners: ((orders: Order[]) => void)[] = [];

  static getInstance(): OrderSyncService {
    if (!OrderSyncService.instance) {
      OrderSyncService.instance = new OrderSyncService();
    }
    return OrderSyncService.instance;
  }

  constructor() {
    this.setupEventListeners();
    // Initialize sync with main website
    websiteConnectionService.syncWithMainWebsite();
  }

  private setupEventListeners() {
    // Listen for updates from the main website
    window.addEventListener('ordersUpdated', (event: any) => {
      this.notifyListeners(event.detail);
    });
  }

  // Get orders from the main pizza website
  getOrders(): Order[] {
    try {
      // Try to access the main website's localStorage through cross-origin communication
      // For development, we'll simulate this with shared localStorage
      const orders = localStorage.getItem('pizzacraft_orders') || localStorage.getItem('orders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return this.getMockOrders();
    }
  }

  // Update order status
  updateOrderStatus(orderId: string, status: Order['status'], estimatedDelivery?: string): void {
    try {
      const orders = this.getOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status,
          ...(estimatedDelivery && { estimated_delivery: estimatedDelivery }),
          ...(status === 'delivered' && { delivered_at: new Date().toISOString() })
        };

        // Update both possible localStorage keys for compatibility
        localStorage.setItem('pizzacraft_orders', JSON.stringify(orders));
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Notify listeners
        this.notifyListeners(orders);
        
        // Send update to main website
        websiteConnectionService.sendUpdateToMainWebsite(orderId, status);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  // Subscribe to order updates
  subscribe(callback: (orders: Order[]) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(orders: Order[]): void {
    this.listeners.forEach(listener => listener(orders));
  }

  private getMockOrders(): Order[] {
    // No demo orders — return empty array when there is no real data available
    return [];
  }
}

export const orderSyncService = OrderSyncService.getInstance();
