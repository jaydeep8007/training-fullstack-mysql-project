import { Navigate } from "react-router-dom";
import { lazy } from "react";
import StripeCheckoutForm from "@/pages/payment/PremiumPlanes";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import PaymentFailed from "@/pages/payment/PaymentFailed";

const AdminLogin = lazy(() => import("@/pages/admin/auth/AdminLogin"));
const AdminSignup = lazy(() => import("@/pages/admin/auth/AdminSignup"));
const AdminForgotPassword = lazy(() => import("@/pages/admin/auth/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("@/pages/admin/auth/AdminResetPassword"));

export const publicRoutes = [
  { path: "/", element: <Navigate to="/customer-login" replace /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/admin-signup", element: <AdminSignup /> },
  { path: "/admin-forgot-password", element: <AdminForgotPassword /> },
  { path: "/admin-reset-password/:token", element: <AdminResetPassword /> },
  { path: "/subscription-planes", element: <StripeCheckoutForm /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-failed", element: <PaymentFailed /> },
];

export const publicBreadcrumbs = [
  { path: "/admin-login", breadcrumb: "Admin Login" },
  { path: "/admin-signup", breadcrumb: "Admin Sign Up" },
  { path: "/admin-forgot-password", breadcrumb: "Forgot Password" },
  { path: "/admin-reset-password/:token", breadcrumb: "Reset Password" },
   { path: "/stripe-payment", element: <StripeCheckoutForm /> },
];
