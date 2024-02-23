import { useEffect } from "react";

import { useAuth } from "~features/auth";

const SgIDCallback = () => {
  const { sgIdAuth } = useAuth();

  useEffect(() => {
    sgIdAuth();
  }, []);

  return <></>;
};

export default SgIDCallback;
