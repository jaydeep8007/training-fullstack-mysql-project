import { lazy } from "react";

const CustomerSignup = lazy(() => import("@/pages/customer/auth/CustomerSignup"));
const CustomerLogin = lazy(() => import("@/pages/customer/auth/CustomerLogin"));
const CustomerProfile = lazy(() => import("@/pages/customer/CustomerProfile"));
const CustomerHome = lazy(() => import("@/pages/customer/customerHome"));
const CustomerForgotPassword = lazy(() => import("@/pages/customer/auth/CustomerForgotPassword"));
const CustomerResetPassword = lazy(() => import("@/pages/customer/auth/CustomerResetPassword"));

export const customerRoutes = [
  { path: "/customer-signup", element: <CustomerSignup /> },
  { path: "/customer-login", element: <CustomerLogin /> },
  { path: "/customer-profile", element: <CustomerProfile /> },
  { path: "/customer-home", element: <CustomerHome /> },
  { path: "/customer-forget-password", element: <CustomerForgotPassword /> },
  { path: "/customer-reset-password/:token", element: <CustomerResetPassword /> },
];

export const customerBreadcrumbs = [
  { path: "/customer-signup", breadcrumb: "Sign Up" },
  { path: "/customer-login", breadcrumb: "Login" },
  { path: "/customer-profile", breadcrumb: "Profile" },
  { path: "/customer-home", breadcrumb: "Home" },
  { path: "/customer-forget-password", breadcrumb: "Forgot Password" },
  { path: "/customer-reset-password/:token", breadcrumb: "Reset Password" },
];
