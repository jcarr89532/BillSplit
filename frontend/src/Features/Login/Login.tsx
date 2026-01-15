import React, { useEffect } from 'react';
import { Receipt as ReceiptIcon } from 'lucide-react';
import { supabaseAuth } from '../../api/api';
import { GoogleOAuthButton } from './components/GoogleOAuthButton/GoogleOAuthButton';
import './Login.css';

interface LoginProps {
  onAuthSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabaseAuth.getSession();
      if (session) {
        onAuthSuccess();
      }
    };
    checkAuth();

    const subscription = supabaseAuth.onAuthStateChange((session) => {
      if (session) {
        onAuthSuccess();
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  return (
    <div className="login-container">
      <div className="login-layout">
        <div className="login-top-section">
          <div className="login-content">
            <div className="login-icon-wrapper">
              <ReceiptIcon className="login-icon" />
            </div>
            <h1 className="login-title">Receipt Splitter</h1>
            <p className="login-subtitle">Split bills with friends</p>
          </div>
        </div>
        <div className="login-bottom-section">
          <GoogleOAuthButton onSignInSuccess={onAuthSuccess} />
        </div>
      </div>
    </div>
  );
};
