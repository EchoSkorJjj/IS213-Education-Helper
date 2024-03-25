import { Helmet } from "react-helmet-async";
import { Box, Text } from "@chakra-ui/react";

const EmptyPage = () => {
  return (
    <Box>
      <Helmet>
        <title>Empty Page</title>
        <meta name="description" content="An empty page template" />
      </Helmet>

      {/* Blue box at the top */}
      <Box
        bg="darkBlue.500"
        py={4}
        px={6}
        color="white"
        h="200px"
        display="flex"
        justifyContent="left"
        alignItems="center"
      >
        {/* You can add content or components inside this blue box */}

        <Text fontSize="lg">Title:</Text>
        <br />
        <Text as="b" fontSize="2xl">
          {" "}
          Microservices{" "}
        </Text>
      </Box>

      {/* Add your page content here */}
    </Box>
  );
};

export default EmptyPage;
