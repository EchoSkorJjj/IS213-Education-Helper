import { Helmet } from "react-helmet-async";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

import LandingPageImage from "~assets/img/landing_page_image.png";

const LandingPage = () => {
  return (
    <Box w="100%" h="100vh">
      <Helmet>
        <title>Landing</title>
        <meta name="description" content="Landing" />
      </Helmet>
      <Flex
        w="100%"
        h="40%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        pt="5"
      >
        <Stack
          w={"full"}
          justify={"end"}
          textAlign={"center"}
          px={{ base: 4, md: 8 }}
          display={{ base: "flex", md: "none" }}
        >
          <Text
            color={"white"}
            lineHeight={1.2}
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          >
            We{" "}
            <Text as="span" fontWeight="bold">
              empower
            </Text>{" "}
            you
            <br />
            to learn what you love
          </Text>
        </Stack>
        <Flex
          display={{ base: "none", md: "flex" }}
          direction="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Flex
            width={{ base: "3xl", lg: "6xl" }}
            h={"100%"}
            backgroundImage={LandingPageImage}
            backgroundSize={"cover"}
            backgroundPosition={"center center"}
          >
            <Stack
              w={"full"}
              justify={"end"}
              textAlign={"start"}
              mt={{ base: 6, md: "none" }}
              px={{ base: 4, md: 8 }}
            >
              <Text
                pl={{ base: 11 }}
                pb={{ base: 11 }}
                color={"white"}
                lineHeight={1.2}
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              >
                We{" "}
                <Text as="span" fontWeight="bold">
                  empower
                </Text>{" "}
                you
                <br />
                to learn what you love
              </Text>
            </Stack>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LandingPage;
