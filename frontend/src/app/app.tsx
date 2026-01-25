import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Login } from '../Features/Login/Login';
import { MainMenu } from '../Features/MainMenu/MainMenu';
import { ItemList } from '../Features/ItemList/ItemList';
import { AuthCallback } from '../Features/Login/components/AuthCallback/AuthCallback';
import { supabaseAuth } from '../api/api';

const CALLBACK_ROUTE = '/auth/callback';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentReceipt, setCurrentReceipt] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isCallbackRoute = location.pathname === CALLBACK_ROUTE;

  useEffect(() => {
    if (isCallbackRoute) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const session = await supabaseAuth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();

    const subscription = supabaseAuth.onAuthStateChange((session) => {
      setIsAuthenticated(!!session);
      if (!session && !isCallbackRoute) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isCallbackRoute]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleImageUpload = async (_file: File) => {
    let response = "temporary response"
    
    setCurrentReceipt(response);
    navigate('/itemList');
  };

  const handleBack = () => {
    setCurrentReceipt(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2d3748' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#a0aec0' }}></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login onAuthSuccess={handleAuthSuccess} />}
      />
      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <MainMenu onImageUpload={handleImageUpload} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/itemList"
        element={currentReceipt ? <ItemList receipt={currentReceipt} onBack={handleBack} /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;
