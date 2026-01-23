import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseAuth } from '../../../../api/api';

export function AuthCallback() {
  const navigate = useNavigate();

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
