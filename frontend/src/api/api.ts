import { createBrowserClient } from "@supabase/ssr";
import { ApiClient } from './client';
import { API_CONFIG } from './config';

// ============================================================================
// Supabase Client
// ============================================================================

if (!API_CONFIG.SUPABASE_URL || !API_CONFIG.SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const createSupabaseClient = () => {
  return createBrowserClient(API_CONFIG.SUPABASE_URL!, API_CONFIG.SUPABASE_KEY!);
};

// ============================================================================
// AWS Client
// ============================================================================

export const awsClient = new ApiClient({
  baseURL: API_CONFIG.AWS_BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT
});

export const { get, post } = awsClient;

// ============================================================================
// Supabase API Calls
// ============================================================================

export const supabaseAuth = {
  async signInWithGoogle() {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  },

  async signOut() {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession() {
    try {
      const supabase = createSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      return session;
    } catch {
      return null;
    }
  },

  async getCurrentUser() {
    try {
      const supabase = createSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return user;
    } catch {
      return null;
    }
  },

  onAuthStateChange(callback: (session: any) => void) {
    const supabase = createSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription;
  },
};

// ============================================================================
// AWS API Calls
// ============================================================================

export const awsApi = {
  async uploadReceipt(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return awsClient.post('/receipts/upload', formData);
  },

  async getReceipt(receiptId: string) {
    return awsClient.get(`/receipts/${receiptId}`);
  },

  async updateReceipt(receiptId: string, data: any) {
    return awsClient.post(`/receipts/${receiptId}/update`, data);
  },

  async deleteReceipt(receiptId: string) {
    return awsClient.post(`/receipts/${receiptId}/delete`);
  },
};
