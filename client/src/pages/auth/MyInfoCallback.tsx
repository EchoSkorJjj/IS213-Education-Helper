import { lazy, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { useAuth } from "~features/auth";

const Loader = lazy(() => import("~components/loader/Loader"));

const MyInfoCallback = () => {
  const { myInfoAuth } = useAuth();

  useEffect(() => {
    myInfoAuth();
  }, []);

  return (
    <>
      <Helmet>
        <title>MyInfo Auth</title>
        <meta name="description" content="MyInfo Auth" />
      </Helmet>
      <Loader />
    </>
  );
};

export default MyInfoCallback;
