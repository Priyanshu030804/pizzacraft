import { supabase } from '../lib/supabase'
import type { CartItem } from '../types'

export const cartService = {
  // Get cart items for a user
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return data?.map(item => ({
        id: item.id,
        pizza: {
          id: item.pizza_id,
          name: item.pizza_name,
          // We'll need to fetch full pizza details if needed
          basePrice: item.unit_price,
          description: '',
          image: '',
          category: 'specialty',
          ingredients: [],
          sizes: [],
          available: true,
          rating: 0,
          reviewCount: 0
        },
        size: {
          id: item.size_id,
          name: item.size_name as 'small' | 'medium' | 'large' | 'xl',
          diameter: '',
          priceMultiplier: 1
        },
        quantity: item.quantity,
        customizations: item.customizations || [],
        totalPrice: item.total_price
      })) || []
    } catch (error) {
      console.error('Error fetching cart items:', error)
      return []
    }
  },

  // Add item to cart
  async addToCart(userId: string, item: {
    pizzaId: string
    pizzaName: string
    sizeId: string
    sizeName: string
    quantity: number
    unitPrice: number
    totalPrice: number
    customizations?: string[]
  }) {
    try {
      console.log('Adding item to cart via service:', item);
      
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('pizza_id', item.pizzaId)
        .eq('size_id', item.sizeId)
        .single()

      console.log('Existing item found:', existingItem);

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + item.quantity
        const newTotalPrice = newQuantity * item.unitPrice

        console.log('Updating existing item:', { newQuantity, newTotalPrice });

        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: newQuantity,
            total_price: newTotalPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)

        if (error) {
          console.error('Error updating existing item:', error);
          throw error;
        }
      } else {
        // Insert new item
        console.log('Inserting new item');
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            pizza_id: item.pizzaId,
            pizza_name: item.pizzaName,
            size_id: item.sizeId,
            size_name: item.sizeName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
            customizations: item.customizations || []
          })

        if (error) {
          console.error('Error inserting new item:', error);
          throw error;
        }
      }

      console.log('Item added to cart successfully');
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  },

  // Update cart item quantity
  async updateCartItem(userId: string, itemId: string, quantity: number) {
    try {
      const { data: item } = await supabase
        .from('cart_items')
        .select('unit_price')
        .eq('id', itemId)
        .eq('user_id', userId)
        .single()

      if (!item) throw new Error('Cart item not found')

      const newTotalPrice = quantity * item.unit_price

      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          total_price: newTotalPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    }
  },

  // Remove item from cart
  async removeFromCart(userId: string, itemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  },

  // Clear cart
  async clearCart(userId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  },

  // Get cart total
  async getCartTotal(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('total_price')
        .eq('user_id', userId)

      if (error) throw error

      return data?.reduce((total, item) => total + item.total_price, 0) || 0
    } catch (error) {
      console.error('Error getting cart total:', error)
      return 0
    }
  }
}
