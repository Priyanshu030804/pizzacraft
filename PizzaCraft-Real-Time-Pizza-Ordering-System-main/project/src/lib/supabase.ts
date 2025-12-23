// Removed Supabase backend. Provide a safe stub so legacy imports don't crash.
// This avoids runtime errors from missing env vars and library removal.
interface StubQuery {
  select: (..._args: any[]) => StubQuery;
  eq: (..._args: any[]) => StubQuery;
  or: (..._args: any[]) => StubQuery;
  order: (..._args: any[]) => Promise<{ data: any[]; error: null }> | StubQuery;
  single: () => Promise<{ data: any; error: null }>;
  insert: (..._args: any[]) => Promise<{ data: any; error: null }>;
  update: (..._args: any[]) => Promise<{ data: any; error: null }>;
  delete: (..._args: any[]) => Promise<{ data: any; error: null }>;
  limit?: (..._args: any[]) => Promise<{ data: any[]; error: null }>;
}

const stubQuery: StubQuery = {
  select: () => stubQuery,
  eq: () => stubQuery,
  or: () => stubQuery,
  order: async () => ({ data: [], error: null }),
  single: async () => ({ data: null, error: null }),
  insert: async () => ({ data: null, error: null }),
  update: async () => ({ data: null, error: null }),
  delete: async () => ({ data: null, error: null })
};

export const supabase = {
  from: () => stubQuery,
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null })
  }
} as const;

// Database types based on your schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          password_hash: string
          phone: string | null
          role: 'customer' | 'staff' | 'admin'
          email_verified: boolean | null
          verification_token: string | null
          reset_token: string | null
          reset_expires: string | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          password_hash: string
          phone?: string | null
          role?: 'customer' | 'staff' | 'admin'
          email_verified?: boolean | null
          verification_token?: string | null
          reset_token?: string | null
          reset_expires?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          password_hash?: string
          phone?: string | null
          role?: 'customer' | 'staff' | 'admin'
          email_verified?: boolean | null
          verification_token?: string | null
          reset_token?: string | null
          reset_expires?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      pizzas: {
        Row: {
          id: string
          name: string
          description: string
          image: string | null
          base_price: number
          category: 'vegetarian' | 'meat' | 'seafood' | 'specialty'
          ingredients: string[] | null
          available: boolean | null
          rating: number | null
          review_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          image?: string | null
          base_price: number
          category: 'vegetarian' | 'meat' | 'seafood' | 'specialty'
          ingredients?: string[] | null
          available?: boolean | null
          rating?: number | null
          review_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image?: string | null
          base_price?: number
          category?: 'vegetarian' | 'meat' | 'seafood' | 'specialty'
          ingredients?: string[] | null
          available?: boolean | null
          rating?: number | null
          review_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      pizza_sizes: {
        Row: {
          id: string
          pizza_id: string | null
          name: 'small' | 'medium' | 'large' | 'xl'
          diameter: string
          price_multiplier: number
          created_at: string | null
        }
        Insert: {
          id?: string
          pizza_id?: string | null
          name: 'small' | 'medium' | 'large' | 'xl'
          diameter: string
          price_multiplier?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          pizza_id?: string | null
          name?: 'small' | 'medium' | 'large' | 'xl'
          diameter?: string
          price_multiplier?: number
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          subtotal: number
          tax: number
          delivery_fee: number
          total: number
          status: 'pending' | 'confirmed' | 'preparing' | 'baking' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled'
          delivery_address: {
            street: string
            city: string
            state: string
            zip: string
            phone: string
          }
          payment_method: 'card' | 'cash'
          payment_status: 'pending' | 'paid' | 'failed'
          payment_intent_id: string | null
          notes: string | null
          estimated_delivery: string | null
          delivered_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          subtotal: number
          tax?: number
          delivery_fee?: number
          total: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'baking' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled'
          delivery_address: {
            street: string
            city: string
            state: string
            zip: string
            phone: string
          }
          payment_method?: 'card' | 'cash'
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_intent_id?: string | null
          notes?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          subtotal?: number
          tax?: number
          delivery_fee?: number
          total?: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'baking' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled'
          delivery_address?: {
            street: string
            city: string
            state: string
            zip: string
            phone: string
          }
          payment_method?: 'card' | 'cash'
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_intent_id?: string | null
          notes?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          pizza_id: string | null
          size_id: string | null
          quantity: number
          unit_price: number
          total_price: number
          customizations: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          pizza_id?: string | null
          size_id?: string | null
          quantity?: number
          unit_price: number
          total_price: number
          customizations?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          pizza_id?: string | null
          size_id?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          customizations?: string[] | null
          created_at?: string | null
        }
      }
      inventory: {
        Row: {
          id: string
          name: string
          type: 'base' | 'sauce' | 'cheese' | 'vegetable' | 'meat' | 'other'
          quantity: number
          unit: string
          min_quantity: number
          price_per_unit: number | null
          supplier: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: 'base' | 'sauce' | 'cheese' | 'vegetable' | 'meat' | 'other'
          quantity?: number
          unit: string
          min_quantity?: number
          price_per_unit?: number | null
          supplier?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'base' | 'sauce' | 'cheese' | 'vegetable' | 'meat' | 'other'
          quantity?: number
          unit?: string
          min_quantity?: number
          price_per_unit?: number | null
          supplier?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string | null
          pizza_id: string | null
          order_id: string | null
          rating: number
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          pizza_id?: string | null
          order_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          pizza_id?: string | null
          order_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string | null
        }
      }
    }
  }
}