import { Navigate, Outlet } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivateRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={{ pathname: "/" }} />;
};

export default PrivateRoute;
