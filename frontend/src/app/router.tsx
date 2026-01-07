import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReceiptUpload } from '../features/receipts/pages/ReceiptUpload';
import { UsersPage } from '../features/users/pages/UsersPage';
import { SignIn } from '../features/auth/pages/SignIn';
import { OAuthConsent } from '../features/auth/pages/OAuthConsent';
import { TodosPage } from '../features/todos/pages/TodosPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/oauth/consent" element={<OAuthConsent />} />
        <Route path="/receipts" element={<Protected><ReceiptUpload /></Protected>} />
        <Route path="/friends" element={<Protected><UsersPage /></Protected>} />
        <Route path="/todos" element={<Protected><TodosPage /></Protected>} />
      </Routes>
    </Router>
  );
};
