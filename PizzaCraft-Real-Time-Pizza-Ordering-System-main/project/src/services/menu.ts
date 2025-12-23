import { supabase } from '../lib/supabase'
import type { Pizza, PizzaSize } from '../types'

export const menuService = {
  async getPizzas(filters?: {
    category?: string
    available?: boolean
    search?: string
  }) {
    try {
      let query = supabase
        .from('pizzas')
        .select(`
          *,
          pizza_sizes (*)
        `)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.available !== undefined) {
        query = query.eq('available', filters.available)
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order('name')

      if (error) throw error

      return data?.map(pizza => ({
        id: pizza.id,
        name: pizza.name,
        description: pizza.description,
        image: pizza.image,
        basePrice: Number(pizza.base_price),
        category: pizza.category,
        ingredients: pizza.ingredients || [],
        available: pizza.available ?? true,
        rating: Number(pizza.rating) || 0,
        reviewCount: pizza.review_count || 0,
        sizes: pizza.pizza_sizes?.map((size: { id: string; name: string; diameter: string; price_multiplier: number }) => ({
          id: size.id,
          name: size.name,
          diameter: size.diameter,
          priceMultiplier: Number(size.price_multiplier),
        })) || [],
        createdAt: pizza.created_at,
        updatedAt: pizza.updated_at,
      })) as Pizza[]
    } catch (error) {
      console.error('Get pizzas error:', error)
      throw error
    }
  },

  async getPizza(id: string) {
    try {
      const { data, error } = await supabase
        .from('pizzas')
        .select(`
          *,
          pizza_sizes (*),
          reviews (
            *,
            users (first_name, last_name)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        image: data.image,
        basePrice: Number(data.base_price),
        category: data.category,
        ingredients: data.ingredients || [],
        available: data.available ?? true,
        rating: Number(data.rating) || 0,
        reviewCount: data.review_count || 0,
        sizes: data.pizza_sizes?.map((size: { id: string; name: string; diameter: string; price_multiplier: number }) => ({
          id: size.id,
          name: size.name,
          diameter: size.diameter,
          priceMultiplier: Number(size.price_multiplier),
        })) || [],
        reviews: data.reviews?.map((review: { id: string; user_id: string; rating: number; comment: string; created_at: string; users?: { first_name?: string; last_name?: string } }) => ({
          id: review.id,
          userId: review.user_id,
          userName: `${review.users?.first_name} ${review.users?.last_name}`,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
        })) || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Pizza
    } catch (error) {
      console.error('Get pizza error:', error)
      throw error
    }
  },

  async getPizzaSizes() {
    try {
      const { data, error } = await supabase
        .from('pizza_sizes')
        .select('*')
        .order('price_multiplier')

      if (error) throw error

      return data?.map(size => ({
        id: size.id,
        pizzaId: size.pizza_id,
        name: size.name,
        diameter: size.diameter,
        priceMultiplier: Number(size.price_multiplier),
        createdAt: size.created_at,
      })) as PizzaSize[]
    } catch (error) {
      console.error('Get pizza sizes error:', error)
      throw error
    }
  },

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('pizzas')
        .select('category')
        .order('category')

      if (error) throw error

      const categories = [...new Set(data?.map(item => item.category))]
      return categories
    } catch (error) {
      console.error('Get categories error:', error)
      throw error
    }
  }
}