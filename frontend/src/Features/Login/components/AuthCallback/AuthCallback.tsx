<<<<<<< HEAD
import { useEffect } from 'react';
=======
import { useEffect, useRef } from 'react';
>>>>>>> origin/main
import { useNavigate } from 'react-router-dom';
import { supabaseAuth } from '../../../../api/api';

export function AuthCallback() {
  const navigate = useNavigate();
<<<<<<< HEAD

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get the session (Supabase automatically processes hash fragments)
        const session = await supabaseAuth.getSession();
        
        if (session) {
          // Clean up URL hash and redirect to home
          window.history.replaceState({}, '', '/');
          navigate('/', { replace: true });
        } else {
          // No session found, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
=======
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleSuccess = () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      window.history.replaceState({}, '', '/');
      navigate('/', { replace: true });
    };

    const handleFailure = () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      navigate('/login', { replace: true });
    };

    // Listen for auth state changes (fires when code is exchanged)
    const subscription = supabaseAuth.onAuthStateChange((session) => {
      if (session) {
        handleSuccess();
      } else if (hasProcessed.current === false) {
        // Only handle failure if we haven't processed yet
        setTimeout(handleFailure, 1500);
      }
    });

    // Retry checking session (fallback for code exchange)
    const checkSession = async () => {
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const session = await supabaseAuth.getSession();
        if (session) {
          handleSuccess();
          return;
        }
      }
      handleFailure();
    };

    checkSession();

    return () => subscription.unsubscribe();
>>>>>>> origin/main
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2d3748' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#a0aec0' }}></div>
        <p style={{ color: '#a0aec0' }}>Completing sign in...</p>
      </div>
    </div>
  );
}
