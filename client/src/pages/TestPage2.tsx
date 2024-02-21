import { useEffect } from "react";

import { useAuth } from "~features/auth";

const TestPage2 = () => {
  const { sgIdAuth } = useAuth();

  useEffect(() => {
    sgIdAuth();
  }, []);

  return <></>;
};

export default TestPage2;
