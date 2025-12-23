// Supabase removed - using MongoDB backend
// Stub client to prevent crashes in legacy code

const createStubClient = () => ({
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase removed') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Supabase removed') })
      })
    }),
    insert: async () => ({ data: null, error: new Error('Supabase removed') }),
    update: async () => ({ data: null, error: new Error('Supabase removed') }),
    delete: async () => ({ data: null, error: new Error('Supabase removed') })
  })
});

export const supabase = createStubClient();
