import { Helmet } from "react-helmet-async";
import { FaCheckCircle } from "react-icons/fa";
import {
  Box,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuth } from "~features/auth/AuthContext";
import { useEffect } from "react";

const SuccessPage = () => {
  const { retrieveAndUpdateUserInfo } = useAuth();
  useEffect(() => {
    retrieveAndUpdateUserInfo();
  }, []);

  return (
    <Box py={12} h="100vh">
      <Helmet>
        <title>Subscription Successful</title>
        <meta name="description" content="Subscription successful" />
      </Helmet>
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" fontSize="4xl" color="white">
          Congratulations! Your Subscription is Active!
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          Thank you for subscribing. You now have access to all the Pro
          features.
        </Text>
        <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="md">
          <Heading as="h2" size="lg" mb={4}>
            Pro Subscription Details
          </Heading>
          <hr />
          <List spacing={3} mt={3}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Notes Generation
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Access to Marketplace
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Quiz Generation
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Unlock Quiz in Marketplace
            </ListItem>
          </List>
        </Box>
      </VStack>
    </Box>
  );
};

export default SuccessPage;
