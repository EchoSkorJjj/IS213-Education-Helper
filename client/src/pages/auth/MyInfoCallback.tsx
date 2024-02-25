import { lazy, useEffect } from "react";

import { useAuth } from "~features/auth";

const Loader = lazy(() => import("~components/loader/Loader"));

const MyInfoCallback = () => {
  const { myInfoAuth } = useAuth();

  useEffect(() => {
    myInfoAuth();
  }, []);

  return <Loader />;
};

export default MyInfoCallback;
