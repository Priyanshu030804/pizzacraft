// Real-time sync service to connect admin dashboard with main pizza website
export class WebsiteConnectionService {
  private static instance: WebsiteConnectionService;
  
  static getInstance(): WebsiteConnectionService {
    if (!WebsiteConnectionService.instance) {
      WebsiteConnectionService.instance = new WebsiteConnectionService();
    }
    return WebsiteConnectionService.instance;
  }

  constructor() {
    this.setupCrossOriginSync();
  }

  private setupCrossOriginSync() {
    // Listen for storage changes from the main website
    window.addEventListener('storage', (e) => {
      if (e.key === 'orders' || e.key === 'pizzacraft_orders') {
        console.log('Storage event received:', e.key, e.newValue);
        // Notify admin dashboard of order changes
        window.dispatchEvent(new CustomEvent('ordersUpdated', {
          detail: e.newValue ? JSON.parse(e.newValue) : []
        }));
      }
    });

    // Listen for custom events and postMessage from the main website
    window.addEventListener('message', (event) => {
      console.log('Message received in admin dashboard:', event.data);
      // In a real deployment, you'd check event.origin for security
      if (event.data.type === 'ORDER_UPDATE') {
        this.handleOrderUpdate(event.data.order);
      } else if (event.data.type === 'NEW_ORDER') {
        this.handleNewOrder(event.data.order);
      }
    });

    // Also listen for custom events
    window.addEventListener('ordersUpdated', (event: any) => {
      console.log('Admin dashboard received order updates:', event.detail);
    });

    // More frequent polling for better sync (every 2 seconds)
    setInterval(() => {
      this.syncWithMainWebsite();
    }, 2000);

    // Initial sync
    this.syncWithMainWebsite();
  }

  private handleNewOrder(order: any) {
    console.log('New order received in admin dashboard:', order);
    // Add to existing orders
    const orders = JSON.parse(localStorage.getItem('pizzacraft_orders') || '[]');
    const updatedOrders = [order, ...orders.filter((o: any) => o.id !== order.id)];
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.setItem('pizzacraft_orders', JSON.stringify(updatedOrders));
    
    window.dispatchEvent(new CustomEvent('ordersUpdated', {
      detail: updatedOrders
    }));
  }

  private handleOrderUpdate(order: any) {
    // Update local storage and notify components
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.map((o: any) => 
      o.id === order.id ? { ...o, ...order } : o
    );
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    localStorage.setItem('pizzacraft_orders', JSON.stringify(updatedOrders));
    
    window.dispatchEvent(new CustomEvent('ordersUpdated', {
      detail: updatedOrders
    }));
  }

  // Send updates to the main website
  sendUpdateToMainWebsite(orderId: string, status: string) {
    try {
      // Try to communicate with main website if in same domain
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ADMIN_ORDER_UPDATE',
          orderId,
          status,
          timestamp: new Date().toISOString()
        }, '*');
      }

      // Also trigger storage event for same-origin scenarios
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map((order: any) => 
        order.id === orderId ? { ...order, status } : order
      );
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      localStorage.setItem('pizzacraft_orders', JSON.stringify(updatedOrders));
      
      // Dispatch event for local listeners
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'orders',
        newValue: JSON.stringify(updatedOrders),
        url: window.location.href
      }));

    } catch (error) {
      console.error('Error sending update to main website:', error);
    }
  }

  // Initialize sync with main website data
  syncWithMainWebsite() {
    try {
      // Get current admin dashboard orders
      const currentAdminOrders = localStorage.getItem('pizzacraft_orders');
      
      // Copy orders from main website localStorage if available
      const mainWebsiteOrders = localStorage.getItem('orders');
      
      if (mainWebsiteOrders && mainWebsiteOrders !== currentAdminOrders) {
        console.log('Syncing orders from main website to admin dashboard');
        localStorage.setItem('pizzacraft_orders', mainWebsiteOrders);
        
        // Notify components of the update
        window.dispatchEvent(new CustomEvent('ordersUpdated', {
          detail: JSON.parse(mainWebsiteOrders)
        }));
      }
    } catch (error) {
      console.error('Error syncing with main website:', error);
    }
  }
}

export const websiteConnectionService = WebsiteConnectionService.getInstance();
