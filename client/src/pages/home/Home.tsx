import { Helmet } from "react-helmet-async";
import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

import LongArrowRight from "~assets/img/right_arrow.svg";

const HomePage = () => {
  return (
    <Box minH="100vh" w="100%">
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Home" />
      </Helmet>
      <Flex
        w="100%"
        minH="90vh"
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        pt={{ base: "10", md: "5" }}
        pb={{ base: "10", md: "0" }}
      >
        <Stack spacing={{ base: "3em", md: "5em" }}>
          <Box
            bg="midBlue.500"
            width={{ base: "90%", md: "30em" }}
            height={{ base: "auto", md: "25em" }}
            p={{ base: "4em 2em", md: "8em 5em 8em 8em" }}
            as="a"
            href="/generator"
            textAlign={{ base: "center", md: "left" }}
          >
            <Text
              color="white"
              lineHeight={1.2}
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              Create notes with
              <br />
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                as="span"
                fontWeight="bold"
              >
                Notes
              </Text>
              <br />
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                as="span"
                fontWeight="bold"
              >
                Generator
              </Text>
            </Text>
            <Flex justifyContent={{ base: "center", md: "flex-start" }}>
              <Image src={LongArrowRight} mt="6" />
            </Flex>
          </Box>
          <Box
            bg="midBlue.500"
            width={{ base: "90%", md: "30em" }}
            height={{ base: "auto", md: "25em" }}
            p={{ base: "4em 2em", md: "8em 5em 8em 8em" }}
            as="a"
            href="/marketplace"
            textAlign={{ base: "center", md: "left" }}
          >
            <Text
              color="white"
              lineHeight={1.2}
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              View our
              <br />
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                as="span"
                fontWeight="bold"
              >
                Notes
              </Text>
              <br />
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                as="span"
                fontWeight="bold"
              >
                Marketplace
              </Text>
            </Text>
            <Flex justifyContent={{ base: "center", md: "flex-start" }}>
              <Image src={LongArrowRight} mt="6" />
            </Flex>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default HomePage;
