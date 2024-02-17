import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import PermissionService from "~shared/services/permission/Permission.service";

import { useAuth } from "~features/auth";

interface PrivateRouteProps {
  resourceRequested: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ resourceRequested }) => {
  const { isAuthenticated } = useAuth();

  const permissionService = new PermissionService();
  const hasRequiredPermissions =
    isAuthenticated && permissionService.canAccess(resourceRequested);

  return hasRequiredPermissions ? (
    <Outlet />
  ) : (
    <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
  );
};

export default PrivateRoute;

// Usage:

/*
 * <Route element={<PrivateRoute resourceRequested="resourceRequested name1" />}>
 *  <Route index element={<Component1 />} />
 * </Route>
 * <Route element={<PrivateRoute resourceRequested="resourceRequested name2" />}>
 *  <Route path="path" element={<Component2 />} />
 * </Route>
 */
