import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Login } from '../Features/Login/Login';
import { MainMenu } from '../Features/MainMenu/MainMenu';
import { ItemList } from '../Features/ItemList/ItemList';
import { HistoryList } from '../Features/HistoryList/HistoryList';
import { AuthCallback } from '../Features/Login/components/AuthCallback/AuthCallback';
import { supabaseAuth, awsApi, supabaseFunctions } from '../api/api';
import type { ItemizedBill } from '../Features/ItemList/models/ItemizedBill';

const CALLBACK_ROUTE = '/auth/callback';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentReceipt, setCurrentReceipt] = useState<any>(null);
  const [bills, setBills] = useState<ItemizedBill[]>([]);
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

const handleImageUpload = async (file: File) => {
    try {
      // 1. Get presigned URL
      const { data } = await awsApi.getUploadURL(file.name);
      const { url: presignedUrl, bucket, key } = data;
      console.log('Presigned URL:', presignedUrl);
      
      // 2. Upload file to S3 using presigned URL
      // Convert File to Blob to prevent browser from auto-adding Content-Type
      const fileBlob = new Blob([file]);
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: fileBlob,
        headers: {},
      });

      if (uploadResponse.status !== 200) {
        throw new Error(`Failed to upload file to S3: ${uploadResponse.status}`);
      }

      // 3. Extract text from receipt image using AWS Textract
      const response = await awsApi.extract(bucket, key);

      // 4. Set the response to currentReceipt
      setCurrentReceipt(response?.data);
      navigate('/itemList');
    } catch (error) {
      console.error('Error processing receipt:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleBack = () => {
    setCurrentReceipt(null);
    navigate('/');
  };

  const onHistoryClick = async () => {
    try {
      const data = await supabaseFunctions.getMyBills();
      const bills = data as ItemizedBill[];
      setBills(bills);
      navigate('/history');
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
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
        element={isAuthenticated ? <MainMenu onImageUpload={handleImageUpload} onHistoryClick={onHistoryClick} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/itemList"
        element={currentReceipt ? <ItemList receipt={currentReceipt} onBack={handleBack} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/history"
        element={isAuthenticated ? <HistoryList bills={bills} onBack={handleBack} /> : <Navigate to="/login" replace />}
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
