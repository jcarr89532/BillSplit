import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '../../../utils/supabase/client';
import { authService } from '../services/authService';

type Session = Awaited<ReturnType<ReturnType<typeof createClient>['auth']['getSession']>>['data']['session'];

export interface AuthState {
  user: User | null;
  session: Session;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    authService.getSession().then((session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    }).catch((error) => {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: error.message,
      });
    });

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const supabase = createClient();
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });
      });
      subscription = sub;
    } catch (error) {
      // Supabase client not configured
      console.warn('Supabase client not configured');
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signInWithGoogle();
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      }));
      throw error;
    }
  };

  return {
    ...authState,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!authState.user,
  };
};


