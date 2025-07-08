import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";

import { adminRoutes, adminBreadcrumbs } from "./admin.routes";
import { customerRoutes, customerBreadcrumbs } from "./customer.routes";
import { publicRoutes, publicBreadcrumbs } from "./public.routes";

// Combine all breadcrumbs
export const appBreadcrumbs = [
  ...publicBreadcrumbs,
  ...customerBreadcrumbs,
  ...adminBreadcrumbs,
];

export const appRoutes: RouteObject[] = [
  ...publicRoutes,
  ...customerRoutes,
  adminRoutes,
  { path: "*", element: <NotFound /> },
];
