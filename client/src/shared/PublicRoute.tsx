import { Navigate, Outlet, RouteProps, useLocation } from "react-router-dom";

import { useAuth } from "~features/auth";

interface PublicRouteProps extends Omit<RouteProps, "render"> {
  /*
   * If `strict` is true, only non-authenticated users can access the route.
   * If `strict` is false, both authenticated and non-authenticated users can access the route.
   */
  strict?: boolean;
}

const PublicRoute = ({ strict = true }: PublicRouteProps): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && strict) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
