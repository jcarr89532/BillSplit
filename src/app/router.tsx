import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ReceiptUpload } from '../features/receipts/pages/ReceiptUpload';
import { UsersPage } from '../features/users/pages/UsersPage';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReceiptUpload />} />
        <Route path="/friends" element={<UsersPage />} />
      </Routes>
    </Router>
  );
};
