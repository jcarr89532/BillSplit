// Simple API configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: 'http://localhost:3001/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
