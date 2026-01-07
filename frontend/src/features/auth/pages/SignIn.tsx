import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt as ReceiptIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Google icon SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, loading, error, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/receipts');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirect will happen automatically via OAuth flow
    } catch (err) {
      // Error is handled by useAuth hook and displayed below
      console.error('Sign in error:', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <div className="h-screen flex flex-col">
        {/* Logo Section - Top Half */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <ReceiptIcon className="mx-auto" style={{ width: '250px', height: '250px', color: '#a0aec0' }} />
            </div>
            <h1 className="text-6xl font-light mb-4" style={{ color: '#a0aec0' }}>
              Receipt Splitter
            </h1>
            <p className="text-xl mb-8" style={{ color: '#a0aec0' }}>
              Split bills with friends
            </p>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-900 bg-opacity-50 rounded-lg max-w-md mx-auto">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sign In Section - Bottom Half */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-1/4 px-8">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 p-6 bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#a0aec0' }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                  <span className="text-lg">Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span className="text-lg font-medium">Sign in with Google</span>
                </>
              )}
            </button>
            
            {!loading && (
              <p className="mt-6 text-center text-sm" style={{ color: '#718096' }}>
                Continue with your Google account to get started
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
