import { lazy, useEffect } from "react";

import { useAuth } from "~features/auth";

const Loader = lazy(() => import("~components/loader/Loader"));

const SgIDCallback = () => {
  const { sgIdAuth } = useAuth();

  useEffect(() => {
    sgIdAuth();
  }, []);

  return <Loader />;
};

export default SgIDCallback;
