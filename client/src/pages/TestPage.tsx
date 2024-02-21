import { useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";

import { useAuth } from "~features/auth";

const TestPage = () => {
  const {
    sgIdGetAuthUrl,
    myInfoGetCode,
    myInfoAuth,
    googleAuth,
    isAuthenticated,
    user,
  } = useAuth();

  useEffect(() => {
    myInfoAuth();
  }, []);

  return (
    <Box>
      <Button colorScheme="blue" onClick={myInfoGetCode}>
        MyInfo auth
      </Button>
      <Button colorScheme="blue" onClick={googleAuth}>
        Google Auth
      </Button>
      <Button colorScheme="blue" onClick={sgIdGetAuthUrl}>
        SGID Auth
      </Button>
      {isAuthenticated && (
        <Box>
          <h1>User Info</h1>
          <p>{JSON.stringify(user)}</p>
        </Box>
      )}
    </Box>
  );
};

export default TestPage;
