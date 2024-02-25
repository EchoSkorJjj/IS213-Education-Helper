import { Navigate, Outlet, RouteProps, useLocation } from "react-router-dom";

interface PublicRouteProps extends Omit<RouteProps, "render"> {
  /*
   * If `strict` is true, only non-authenticated users can access the route.
   * If `strict` is false, both authenticated and non-authenticated users can access the route.
   */
  strict?: boolean;
  isAuthenticated?: boolean;
}

const PublicRoute = ({
  strict = true,
  isAuthenticated,
}: PublicRouteProps): JSX.Element => {
  const location = useLocation();

  if (isAuthenticated && strict) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
