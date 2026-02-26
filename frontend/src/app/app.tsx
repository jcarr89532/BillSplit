import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Login } from '../Features/Login/Login';
import { MainMenu } from '../Features/MainMenu/MainMenu';
import { ItemList } from '../Features/ItemList/ItemList';
import { HistoryList } from '../Features/HistoryList/HistoryList';
import { AuthCallback } from '../Features/Login/components/AuthCallback/AuthCallback';
import { supabaseAuth, awsApi, supabaseFunctions } from '../api/api';
import type { ItemizedBill } from '../Features/ItemList/models/ItemizedBill';
import type { BillSummary } from '../Features/HistoryList/models/BillSummary';

const CALLBACK_ROUTE = '/auth/callback';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentReceipt, setCurrentReceipt] = useState<ItemizedBill | null>(null);
  const [currentBillID, setCurrentBillID] = useState<string | null>(null);
  const [bills, setBills] = useState<BillSummary[]>([]);
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
      const { data } = await awsApi.getUploadURL(file.name);
      const { url: presignedUrl, bucket, key } = data;
      console.log('Presigned URL:', presignedUrl);
      
      const fileBlob = new Blob([file]);
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: fileBlob,
        headers: {},
      });

      if (uploadResponse.status !== 200) {
        throw new Error(`Failed to upload file to S3: ${uploadResponse.status}`);
      }

      const response = await awsApi.extract(bucket, key);

      setCurrentReceipt(response.data);
      setCurrentBillID(null);
      navigate('/itemList');
    } catch (error) {
      console.error('Error processing receipt:', error);
    }
  };

  const handleBack = async () => {
    const billId = currentBillID;
    
    if (location.pathname === '/itemList' && billId) {
      await fetchBills();
      navigate('/history');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (location.pathname !== '/itemList') {
      setCurrentReceipt(null);
      setCurrentBillID(null);
    }
  }, [location.pathname]);

  const onHistoryBillClick = async (bill: BillSummary) => {
    try {
      const billDetails = await supabaseFunctions.getBillDetails(bill.id);
      setCurrentReceipt(billDetails);
      setCurrentBillID(bill.id); // Store the bill id for updates
      navigate('/itemList');
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const fetchBills = async () => {
    try {
      const data = await supabaseFunctions.getMyBills();
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const onHistoryClick = async () => {
    await fetchBills();
    navigate('/history');
  };

  const saveBill = async (bill: ItemizedBill) => {
    try {
      await supabaseFunctions.saveBill(bill);
      navigate('/');
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const updateBill = async (bill: ItemizedBill) => {
    if (!currentBillID) {
      console.error('Cannot update bill: no bill id');
      return;
    }
    try {
      await supabaseFunctions.updateBill({ ...bill, id: currentBillID });
      await fetchBills();
      navigate('/history');
    } catch (error) {
      console.error('Error updating bill:', error);
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
        element={currentReceipt ? <ItemList receipt={currentReceipt} onBack={handleBack} onSave={currentBillID ? updateBill : saveBill} hasId={!!currentBillID} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/history"
        element={isAuthenticated ? <HistoryList bills={bills} onBack={handleBack} onBillClick={onHistoryBillClick} /> : <Navigate to="/login" replace />}
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
