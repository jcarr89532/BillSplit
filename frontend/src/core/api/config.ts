// API configuration with Supabase
export const API_CONFIG = {
  // Base URL for the API (Supabase) - from environment or fallback
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  
  // Supabase API key - from environment or fallback
  SUPABASE_API_KEY: import.meta.env.VITE_SUPABASE_API_KEY,
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_API_KEY
  },
} as const;
