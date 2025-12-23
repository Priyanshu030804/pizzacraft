// Export custom type definitions
export * from './react';
export * from './modules';
export * from './react-augmentation';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  category: 'vegetarian' | 'meat' | 'seafood' | 'specialty';
  ingredients: string[];
  sizes: PizzaSize[];
  available: boolean;
  rating: number;
  reviewCount: number;
}

export interface PizzaSize {
  id: string;
  name: 'small' | 'medium' | 'large' | 'xl';
  diameter: string;
  priceMultiplier: number;
}

export interface CartItem {
  id: string;
  pizza: Pizza;
  size: PizzaSize;
  quantity: number;
  customizations?: string[];
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'baking' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  paymentMethod: 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'base' | 'sauce' | 'cheese' | 'vegetable' | 'meat';
  quantity: number;
  unit: string;
  minQuantity: number;
  pricePerUnit: number;
  supplier?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}