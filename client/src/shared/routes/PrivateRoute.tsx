import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={{ pathname: "/" }} />;
};

export default PrivateRoute;
