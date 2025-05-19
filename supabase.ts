// Placeholder file - Supabase removed
export const auth = {
  getSession: () => Promise.resolve({ data: { session: null } }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithPassword: () => Promise.resolve({ error: null }),
  signUp: () => Promise.resolve({ error: null }),
  signOut: () => Promise.resolve()
};