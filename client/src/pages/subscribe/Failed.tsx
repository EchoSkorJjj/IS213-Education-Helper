import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle } from "react-icons/fa";
import { Box, Button, Heading, Icon, Text, VStack } from "@chakra-ui/react";

const FailedPage = () => {
  const textColor = "white";

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
            onClick={() => {
              /* Handle retry subscription */
            }}
          >
            Retry Subscription
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default FailedPage;
