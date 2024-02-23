import { useEffect } from "react";

import { useAuth } from "~features/auth";

const MyInfoCallback = () => {
  const { myInfoAuth } = useAuth();

  useEffect(() => {
    myInfoAuth();
  }, []);

  return <></>;
};

export default MyInfoCallback;
