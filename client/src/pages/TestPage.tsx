import { Box, Button } from "@chakra-ui/react";

import { useAuth } from "~features/auth";

const TestPage = () => {
  const { appleAuth, googleAuth } = useAuth();
  return (
    <Box>
      <Button colorScheme="blue" onClick={appleAuth}>
        Apple Auth
      </Button>
      <Button colorScheme="blue" onClick={googleAuth}>
        Google Auth
      </Button>
    </Box>
  );
};

export default TestPage;
