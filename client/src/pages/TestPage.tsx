import { Box, Button } from "@chakra-ui/react";

import { useAuth } from "~features/auth";

const TestPage = () => {
  const { userStorageTest, googleAuth } = useAuth();
  return (
    <Box>
      <Button colorScheme="blue" onClick={userStorageTest}>
        Hit userstorage endpoint
      </Button>
      <Button colorScheme="blue" onClick={googleAuth}>
        Google Auth
      </Button>
    </Box>
  );
};

export default TestPage;
