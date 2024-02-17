import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "~shared/PrivateRoute";

import { useHead } from "~features/page-header/title/TitleContext";

import ViewDashboard from "./ViewDashboard";
import ViewUserList from "./ViewUserList";

const Dashboard = () => {
  const updateHead = useHead();
  useEffect(() => {
    updateHead("Dashboard", {
      description: "Dashboard",
      keywords: "Dashboard",
    });
  }, []);

  return (
    <Routes>
      {/* Check if user has permission to access this route/resource requested */}
      <Route element={<PrivateRoute resourceRequested="dashboard" />}>
        {/* When user is navigated to /dashboard, this component will be rendered by default */}
        <Route index element={<ViewDashboard />} />
      </Route>
      <Route element={<PrivateRoute resourceRequested="gayneil" />}>
        {/* When user is navigated to /dashboard/userlist, this component will be rendered */}
        <Route path="gayneil" element={<ViewUserList />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
