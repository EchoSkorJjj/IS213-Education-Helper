import { Helmet } from "react-helmet-async";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Box textAlign="center" py={10} px={6} height="100vh">
      <Helmet>
        <title>Not Found</title>
        <meta name="description" content="Not Found" />
      </Helmet>
      <Flex
        w="100%"
        h="90%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        pt="5"
      >
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bg="lightBlue.500"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="xl" fontWeight="bold" color="white" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={"gray.600"} mb={6}>
          The page you&apos;re looking for does not seem to exist
        </Text>

        <Button as="a" href="/" variant="solid">
          Go to home
        </Button>
      </Flex>
    </Box>
  );
};

export default NotFound;
