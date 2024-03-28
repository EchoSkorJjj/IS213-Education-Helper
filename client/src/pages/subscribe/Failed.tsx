import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle } from "react-icons/fa";
import { Box, Button, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { getCheckoutUrl } from "~features/api";
import { useAuth } from "~features/auth";

const FailedPage = () => {
  const textColor = "white";
  const { user, authorization } = useAuth();
  const email = user?.email;

  const handleSubscribe = async () => {
    if (!email || !authorization) {
      return;
    }

    const url = await getCheckoutUrl(email, authorization);
    console.log(url);
    window.location.href = url;
  };

  return (
    <Box py={12} minHeight="100vh">
      <Helmet>
        <title>Subscription Unsuccessful</title>
        <meta name="description" content="Subscription unsuccessful" />
      </Helmet>
      <VStack spacing={6} textAlign="center">
        <Icon as={FaExclamationTriangle} boxSize={16} color="yellow.500" />
        <Heading as="h1" fontSize="4xl" color="white">
          Oops! Subscription Unsuccessful...
        </Heading>
        <Text fontSize="lg" color={textColor} maxW="lg">
          We apologize for the inconvenience. It seems that the checkout process
          was unsuccessful. Please try again.
        </Text>
        <Box mt={8}>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={handleSubscribe}
          >
            Retry Subscription
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default FailedPage;
