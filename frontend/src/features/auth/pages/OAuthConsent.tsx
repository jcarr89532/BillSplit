import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Receipt as ReceiptIcon, Check, X, Shield, User, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const OAuthConsent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);

  // Get OAuth parameters from URL
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const scope = searchParams.get('scope') || 'read write';
  const state = searchParams.get('state');
  const responseType = searchParams.get('response_type') || 'code';

  // Default permissions/scopes
  const permissions = scope.split(' ').map(s => ({
    name: s,
    description: getPermissionDescription(s)
  }));

  function getPermissionDescription(perm: string): string {
    const descriptions: Record<string, string> = {
      'read': 'Read your account information',
      'write': 'Modify your account data',
      'profile': 'Access your profile information',
      'email': 'Access your email address',
      'openid': 'Verify your identity',
    };
    return descriptions[perm] || `Access ${perm} permissions`;
  }

  // Generate a simple authorization code (in production, this would be generated server-side)
  const generateAuthCode = (): string => {
    return `auth_code_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      // Build authorization code response
      const authCode = generateAuthCode();
      const redirectUrl = new URL(redirectUri || window.location.origin);
      redirectUrl.searchParams.set('code', authCode);
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }
      
      // Redirect with authorization code
      window.location.href = redirectUrl.toString();
    } catch (error) {
      console.error('OAuth approval error:', error);
      setProcessing(false);
    }
  };

  const handleDeny = () => {
    const redirectUrl = new URL(redirectUri || window.location.origin);
    redirectUrl.searchParams.set('error', 'access_denied');
    redirectUrl.searchParams.set('error_description', 'User denied the request');
    if (state) {
      redirectUrl.searchParams.set('state', state);
    }
    window.location.href = redirectUrl.toString();
  };

  // Redirect if already authenticated and auto-approve is enabled
  useEffect(() => {
    const autoApprove = searchParams.get('auto_approve') === 'true';
    if (isAuthenticated && autoApprove && redirectUri) {
      const authCode = generateAuthCode();
      const redirectUrl = new URL(redirectUri);
      redirectUrl.searchParams.set('code', authCode);
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }
      window.location.href = redirectUrl.toString();
    }
  }, [isAuthenticated, redirectUri, state, searchParams]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <div className="h-screen flex flex-col">
        {/* Logo Section - Top Half */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl px-8">
            <div className="mb-8">
              <ReceiptIcon className="mx-auto" style={{ width: '120px', height: '120px', color: '#a0aec0' }} />
            </div>
            <h1 className="text-4xl font-light mb-4" style={{ color: '#a0aec0' }}>
              Authorize Application
            </h1>
            <p className="text-lg mb-8" style={{ color: '#a0aec0' }}>
              Receipt Splitter wants to access your account
            </p>

            {/* Client Info */}
            {clientId && (
              <div className="mb-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <p className="text-sm" style={{ color: '#718096' }}>
                  Application: <span style={{ color: '#a0aec0' }}>{clientId}</span>
                </p>
              </div>
            )}

            {/* User Info */}
            {user && (
              <div className="mb-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg flex items-center gap-3">
                <User className="h-5 w-5" style={{ color: '#a0aec0' }} />
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: '#a0aec0' }}>
                    {user.email || user.user_metadata?.email || 'User'}
                  </p>
                  <p className="text-xs" style={{ color: '#718096' }}>
                    You are signed in
                  </p>
                </div>
              </div>
            )}

            {/* Permissions List */}
            <div className="mb-8 text-left">
              <h2 className="text-xl font-medium mb-4" style={{ color: '#a0aec0' }}>
                This application will be able to:
              </h2>
              <div className="space-y-3">
                {permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-700 bg-opacity-30 rounded-lg"
                  >
                    <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#a0aec0' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#a0aec0' }}>
                        {permission.name}
                      </p>
                      <p className="text-xs" style={{ color: '#718096' }}>
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Bottom Half */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-1/4 px-8 space-y-4">
            <button
              onClick={handleApprove}
              disabled={processing || !redirectUri}
              className="w-full flex items-center justify-center gap-3 p-6 bg-green-600 hover:bg-green-700 transition-colors duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#ffffff' }}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  <span className="text-lg font-medium">Processing...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span className="text-lg font-medium">Approve</span>
                </>
              )}
            </button>

            <button
              onClick={handleDeny}
              disabled={processing}
              className="w-full flex items-center justify-center gap-3 p-6 bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#a0aec0' }}
            >
              <X className="h-5 w-5" />
              <span className="text-lg font-medium">Deny</span>
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: '#718096' }}>
                By approving, you allow this application to access your account according to the permissions above.
              </p>
              <div className="mt-2 flex items-center justify-center gap-4 text-xs">
                <a href="#" className="hover:underline" style={{ color: '#718096' }}>
                  <FileText className="h-3 w-3 inline mr-1" />
                  Terms of Service
                </a>
                <span style={{ color: '#718096' }}>•</span>
                <a href="#" className="hover:underline" style={{ color: '#718096' }}>
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
