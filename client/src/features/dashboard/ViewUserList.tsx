import { Link as ReactRouterLink } from "react-router-dom";
import { Box, Link, Text } from "@chakra-ui/react";

const ViewUserList = () => {
  return (
    <Box p={4}>
      <Text>Gay Neil</Text>
      <Link as={ReactRouterLink} to="/dashboard">
        Back to Dashboard
      </Link>
    </Box>
  );
};

export default ViewUserList;
