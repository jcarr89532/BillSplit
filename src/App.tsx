import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SharePage } from '@/pages/SharePage';
import { ClaimPage } from '@/pages/ClaimPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FriendsPage } from '@/pages/FriendsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/claim/:receiptId" element={<ClaimPage />} />
          <Route path="/dashboard/:receiptId" element={<DashboardPage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
