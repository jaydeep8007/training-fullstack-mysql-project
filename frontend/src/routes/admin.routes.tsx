import { Navigate } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));
const GlobalConfigPage = lazy(() => import("@/pages/admin/GlobalConfig"));

const CustomerList = lazy(() => import("@/pages/customer/CustomerList"));
const EmployeeList = lazy(() => import("@/pages/employee/EmployeeList"));

export const adminBreadcrumbs = [
  { path: "/admin/dashboard", breadcrumb: "Dashboard" },
  { path: "/admin/profile", breadcrumb: "Profile" },
  { path: "/admin/global-config", breadcrumb: "Global Config" },
  { path: "/admin/customers", breadcrumb: "Customers" },
  { path: "/admin/customers/add", breadcrumb: "Add Customer" },
  { path: "/admin/employees", breadcrumb: "Employees" },
  { path: "/admin/employees/add", breadcrumb: "Add Employee" },
];

export const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "profile", element: <AdminProfile /> },
    { path: "global-config", element: <GlobalConfigPage /> },
    { path: "customers", element: <CustomerList /> },
    { path: "customers/add", element: <CustomerList /> },
    { path: "employees", element: <EmployeeList /> },
    { path: "employees/add", element: <EmployeeList /> },
  ],
};
