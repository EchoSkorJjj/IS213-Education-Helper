import { Link as ReactRouterLink } from "react-router-dom";
import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";

import { useAuth } from "~features/auth";

const ViewDashboard = () => {
  const {
    user,
    role,
    checkServiceOne,
    checkServiceOnePong,
    checkServiceTwo,
    checkServiceThree,
    googleLogout,
  } = useAuth();
  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Welcome {user?.username}
      </Heading>
      <Text>{user?.email}</Text>
      <Text>{role?.name}</Text>
      <Text>{role?.roles}</Text>
      {/* This is unautorized link. If you want to navigate here, 
      you can go to authentication/src/types/RoleGroups
      and add the following line to roles under User:
      "org.permissions.SERVICENAME.read" */}
      <Link as={ReactRouterLink} to="/dashboard/gayneil">
        Go to gayneil
      </Link>
      <br />
      <Button onClick={checkServiceOne} colorScheme="green" mt={4}>
        Check service one
      </Button>
      <Button onClick={checkServiceOnePong} colorScheme="green" mt={4}>
        Check service one pong
      </Button>
      <Button onClick={checkServiceTwo} colorScheme="green" mt={4}>
        Check service two
      </Button>
      <Button onClick={checkServiceThree} colorScheme="green" mt={4}>
        Check service three
      </Button>
      <Button onClick={googleLogout} colorScheme="red" mt={4}>
        Logout
      </Button>
    </Box>
  );
};

export default ViewDashboard;
