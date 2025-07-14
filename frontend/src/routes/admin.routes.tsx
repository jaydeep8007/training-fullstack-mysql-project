import { Navigate } from "react-router-dom";
import AdminLayout from "@/layout/admin/AdminLayout";
import AdminProtectedWrapper from "@/pages/admin/auth/AdminProtectedWrapper";
import { lazy } from "react";
import AddEmployee from "@/pages/employee/AddEmployee";
import AssignJob from "@/pages/job/AssignJob";
import CreateJob from "@/pages/job/CreateJob";
import ManageJobs from "@/pages/job/ManageJob";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));
const GlobalConfigPage = lazy(() => import("@/pages/admin/GlobalConfigWrapper"));

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
  element: (
    <AdminProtectedWrapper>
      <AdminLayout />
    </AdminProtectedWrapper>
  ),
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "profile", element: <AdminProfile /> },
    { path: "global-config", element: <GlobalConfigPage /> },
    { path: "customers", element: <CustomerList /> },
    { path: "customers/add", element: <CustomerList /> },
    { path: "employees", element: <EmployeeList /> },
    { path: "employees/add", element: <AddEmployee /> },
    { path: "create-job", element: <CreateJob /> },
    { path: "assign-job", element: <AssignJob /> },
    { path: "manage-job", element: <ManageJobs /> },
  ],
};
