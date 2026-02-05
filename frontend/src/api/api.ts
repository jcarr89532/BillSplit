import { createBrowserClient } from "@supabase/ssr";
import { ApiClient } from './client';
import { API_CONFIG } from './config';

// ============================================================================
// Supabase Client
// ============================================================================

if (!API_CONFIG.SUPABASE_URL || !API_CONFIG.SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single client instance to maintain PKCE state across OAuth flow
const supabaseClient = createBrowserClient(API_CONFIG.SUPABASE_URL!, API_CONFIG.SUPABASE_KEY!);

export const createSupabaseClient = () => {
  return supabaseClient;
};

// ============================================================================
// Supabase API Calls
// ============================================================================

export const supabaseAuth = {

  async signInWithGoogle() {
    const redirectUrl = `${window.location.origin}/auth/callback`;

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl },
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
// AWS Client
// ============================================================================

export const awsClient = new ApiClient({
  baseURL: API_CONFIG.AWS_BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT,
  getToken: async () => {
    const session = await supabaseAuth.getSession();
    return session?.access_token || null;
  }
});

export const { get, post } = awsClient;

// ============================================================================
// AWS API Calls
// ============================================================================

export const awsApi = {
  async getUploadURL(name: string) {
    return awsClient.get(`/get-upload-url?filename=${encodeURIComponent(name)}`);
  },

  async extract(bucket: string, key: string) {
    return awsClient.post(`/extract`, { bucket, key });
  },
};
