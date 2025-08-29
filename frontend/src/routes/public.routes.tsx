import { Navigate } from "react-router-dom";
import { lazy } from "react";
import SubscriptionPlanes from "@/pages/payment/PremiumPlanes";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import PaymentFailed from "@/pages/payment/PaymentFailed";
import StripeCheckoutPage from "@/pages/payment/StripeCheckoutPage";
// import PaypalSubscriptionPage from "@/pages/payment/PremiumPlaneSubscription";
import PaymentStatus from "@/pages/payment/PaymentStatus";
import PaypalSuccessPage from "@/pages/payment/PaypalSuccessPage";

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
  { path: "/subscription-planes", element: <SubscriptionPlanes /> },
  // { path: "/subscription-planes", element: <PaypalSubscriptionPage /> },
  { path: "/stripe-checkout-page", element: <StripeCheckoutPage /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-failed", element: <PaymentFailed /> },
  { path: "/payment-status", element: <PaymentStatus /> },
   { path: "/paypal-success", element: <PaypalSuccessPage /> },
  { path: "/paypal-cancel", element: <PaymentFailed /> },
];

export const publicBreadcrumbs = [
  { path: "/admin-login", breadcrumb: "Admin Login" },
  { path: "/admin-signup", breadcrumb: "Admin Sign Up" },
  { path: "/admin-forgot-password", breadcrumb: "Forgot Password" },
  { path: "/admin-reset-password/:token", breadcrumb: "Reset Password" },

];
