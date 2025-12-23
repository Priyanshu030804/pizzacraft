import { sharedOrderService } from '../services/sharedOrderService';

// Utility to create test orders for testing admin dashboard connection
export const createTestOrder = () => {
  const orderId = `test-order-${Date.now()}`;
  
  const testOrder = {
    id: orderId,
    user_id: 'test-user-1',
    user_email: 'test@test.com', // Add user email for filtering
    status: 'pending',
    total: 25.99,
    subtotal: 21.99,
    tax: 1.76,
    delivery_fee: 2.24,
    payment_method: 'razorpay',
    payment_status: 'paid',
    created_at: new Date().toISOString(),
    estimated_delivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    delivery_address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      phone: '555-TEST-123'
    },
    special_instructions: 'Test order from main website',
    order_items: [
      {
        id: `item-${Date.now()}`,
        quantity: 1,
        price: 21.99,
        pizzas: {
          name: 'Test Margherita Pizza',
          image: '/api/placeholder/400/300'
        },
        pizza_sizes: {
          name: 'Large'
        }
      }
    ]
  };

  // Use shared order service for better sync
  const savedOrderId = sharedOrderService.saveOrder(testOrder);
  console.log('Test order created with ID:', savedOrderId);
  
  return orderId;
};
