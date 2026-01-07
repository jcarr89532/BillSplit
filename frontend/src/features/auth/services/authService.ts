import { createClient } from '../../../utils/supabase/client';

export class AuthService {
  async signInWithGoogle(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/receipts`,
      },
    });
    if (error) throw new Error(error.message);
  }

  async signOut(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getSession() {
    try {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      return session;
    } catch {
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return user;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
