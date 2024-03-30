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

      <Box position="relative" bg={"darkBlue.500"} w="100%" h="400">
        <Flex
          position={"absolute"}
          mt="100"
          w="100%"
          h="90%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          pt="10"
        >
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Stack spacing="5em" direction={{ base: "column", md: "row" }}>
              <Box
                bg="midBlue.500"
                width="30em"
                height="25em"
                pl="5em"
                pr="8em"
                pt="8em"
                as="a"
                href="/generator"
              >
                <Text color={"white"} lineHeight={1.2} fontSize="3xl">
                  Create notes with
                  <br />
                  <Text fontSize="4xl" as="span" fontWeight="bold">
                    Notes
                  </Text>
                  <br />
                  <Text fontSize="4xl" as="span" fontWeight="bold">
                    Generator
                  </Text>
                </Text>
                <Image src={LongArrowRight} mt="6" />
              </Box>
              <Box
                bg="midBlue.500"
                width="30em"
                height="25em"
                pl="5em"
                pr="8em"
                pt="8em"
                as="a"
                href="/marketplace"
              >
                <Text color={"white"} lineHeight={1.2} fontSize="3xl">
                  View our
                  <br />
                  <Text fontSize="4xl" as="span" fontWeight="bold">
                    Notes
                  </Text>
                  <br />
                  <Text fontSize="4xl" as="span" fontWeight="bold">
                    Marketplace
                  </Text>
                </Text>
                <Image src={LongArrowRight} mt="6" />
              </Box>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default HomePage;
