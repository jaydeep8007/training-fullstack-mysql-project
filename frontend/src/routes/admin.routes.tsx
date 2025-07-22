import { Navigate } from "react-router-dom";
import AdminLayout from "@/layout/admin/AdminLayout";
import AdminProtectedWrapper from "@/pages/admin/auth/AdminProtectedWrapper";
import { lazy } from "react";
import AddEmployee from "@/pages/employee/AddEmployee";
import AssignJob from "@/pages/job/AssignJob";
import CreateJob from "@/pages/job/CreateJob";
import ManageJobs from "@/pages/job/ManageJob";
import RolesAndPermissions from "@/pages/rolesAndPermissions/RolesAndPermissions";
import AddRole from "@/pages/rolesAndPermissions/AddRoles";
import AdminList from "@/pages/userManagement/AdminList";
import EditRole from "@/pages/rolesAndPermissions/EditRole";
import AddAdmin from "@/pages/userManagement/AddAdmin";
import EditAdmin from "@/pages/userManagement/EditAdmin";

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

  { path: "/admin/create-job", breadcrumb: "Create Job" },
  { path: "/admin/assign-job", breadcrumb: "Assign Job" },
  { path: "/admin/manage-job", breadcrumb: "Manage Jobs" },

  { path: "/admin/roles-and-permissions", breadcrumb: "Roles & Permissions" },
  { path: "/admin/roles-and-permissions/add-roles", breadcrumb: "Add Role" },
  { path: "/admin/roles-and-permissions/edit-role/:id", breadcrumb: "Edit Role" },

  { path: "/admin/user-management", breadcrumb: "Admin Users" },
  { path: "/admin/user-management/add-admin", breadcrumb: "Add Admin" },
  { path: "/admin/user-management/edit-admin/:id", breadcrumb: "Edit Admin" },
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
    { path: "roles-and-permissions", element: <RolesAndPermissions /> },
    { path: "roles-and-permissions/add-roles", element: <AddRole /> },
    { path: "user-management", element: <AdminList /> },
    { path: "roles-and-permissions/edit-role/:id", element: <EditRole /> },
    { path: "user-management/add-admin", element: <AddAdmin /> },
    { path: "user-management/edit-admin/:id", element: <EditAdmin /> },
    
  ],
};
