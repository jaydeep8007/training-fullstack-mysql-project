import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomerSignup from "./pages/customer/auth/CustomerSignup";
import CustomerLogin from "./pages/customer/auth/CustomerLogin";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerHome from "./pages/customer/customerHome";
import CustomerForgotPassword from "./pages/customer/auth/CustomerForgotPassword";
import CustomerResetPassword from "./pages/customer/auth/CustomerResetPassword";

import AdminSignup from "./pages/admin/auth/AdminSignup";
import AdminLogin from "./pages/admin/auth/AdminLogin";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GlobalConfigPage from "./pages/admin/GlobalConfig";

import AdminLayout from "./layout/AdminLayout";
import NotFound from "./pages/NotFound";
import CustomerList from "./pages/admin/CustomerList";
import AdminResetPassword from "./pages/admin/auth/AdminResetPassword";
import AdminForgotPassword from "./pages/admin/auth/AdminForgotPassword";

function App() {
  return (
    <>
      <Routes>
        {/* Redirect base path */}
        <Route path="/" element={<Navigate to="/customer-login" replace />} />

        {/* ✅ Customer Routes */}
        <Route path="/customer-signup" element={<CustomerSignup />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route
          path="/customer-forget-password"
          element={<CustomerForgotPassword />}
        />
        <Route
          path="/customer-reset-password/:token"
          element={<CustomerResetPassword />}
        />

        {/* ✅ Admin Auth Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin-reset-password/:token" element={<AdminResetPassword />} />

        {/* ✅ Admin Layout Route Wrapper */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="global-config" element={<GlobalConfigPage />} />
          <Route path="customers" element={<CustomerList />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toastify */}
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
