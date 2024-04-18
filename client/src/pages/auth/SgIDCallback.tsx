import { lazy, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { useAuth } from "~features/auth";

const Loader = lazy(() => import("~components/loader/Loader"));

const SgIDCallback = () => {
  const { sgIdAuth } = useAuth();

  useEffect(() => {
    sgIdAuth();
  }, []);

  return (
    <>
      <Helmet>
        <title>SgID Auth</title>
        <meta name="description" content="SgID Auth" />
      </Helmet>
      <Loader />
    </>
  );
};

export default SgIDCallback;
