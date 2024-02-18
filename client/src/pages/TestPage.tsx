import { Box, Button } from "@chakra-ui/react";

import { useAuth } from "~features/auth";

const TestPage = () => {
  const { userStorageTest } = useAuth();
  return (
    <Box>
      <Button colorScheme="blue" onClick={userStorageTest}>
        Hit userstorage endpoint
      </Button>
    </Box>
  );
};

export default TestPage;
