import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerSignup from './pages/CustomerSignup';
import CustomerProfile from './pages/CustomerProfile';
import CustomerSignin from './pages/CustomerLogin';

function App() {
  return (
    <Routes>
      {/* Redirect base path to /signup */}
      <Route path="/" element={<Navigate to="/customer-signup" replace />} />

      {/* Signup page */}
      <Route path="/customer-signup" element={<CustomerSignup />} />
      <Route path="/customer-login" element={<CustomerSignin />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />

      {/* Optional: 404 Not Found fallback */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;
