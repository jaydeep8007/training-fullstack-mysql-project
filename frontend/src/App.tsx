import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerSignup from "./pages/customerPages/CustomerSignup";
import CustomerProfile from "./pages/customerPages/CustomerProfile";
import CustomerLogin from "./pages/customerPages/CustomerLogin";
import NotFound from "./pages/NotFound";
import CustomerHome from "./pages/customerPages/customerHomePage";

// ✅ Add these 2 imports for Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSignup from "./pages/adminPages/AdminSignup";
import AdminHome from "./pages/adminPages/AdminHomePage";
import AdminLogin from "./pages/adminPages/AdminLogin";
import AdminProfile from "./pages/adminPages/AdminProfile";
import CustomerForgotPassword from "./pages/customerPages/ForgotPassword";
import CustomerResetPassword from "./pages/customerPages/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        {/* Redirect base path to /signup */}
        <Route path="/" element={<Navigate to="/customer-login" replace />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/admin-home" element={<AdminHome />} />

        {/*  pages */}
        <Route path="/customer-signup" element={<CustomerSignup />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-profile" element={<AdminProfile />} />

        <Route path="/customer-forget-password" element={<CustomerForgotPassword />} />
<Route path="/customer-reset-password/:token" element={<CustomerResetPassword />} />

        {/* Optional: 404 Not Found fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ Toast container must be outside Routes to work globally */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
