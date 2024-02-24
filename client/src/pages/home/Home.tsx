import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

import LongArrowRight from "~assets/img/right_arrow.svg";

const HomePage = () => {
  return (
    <Flex direction="column" h="100vh">
      <Flex flex="45%" bg="darkBlue.500" align="center" justify="center">
        <Box position="relative" height="100%" width="100%">
          <Stack
            position="absolute"
            spacing="5em"
            direction={{ base: "column", md: "row" }}
            bottom="0"
            left="50%"
            transform={{
              base: "translate(-50%, 60%)",
              md: "translate(-50%, 15%)",
            }}
          >
            <Box
              bg="midBlue.500"
              width="30em"
              height="25em"
              pl="5em"
              pr="8em"
              pt="8em"
              as="a"
              href="/generator"
              justifyContent={"center"}
              alignContent="center"
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
        </Box>
      </Flex>
      <Flex flex="55%" bg="white" align="center" justify="center">
        <Box position="relative" height="100%" width="100%"></Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
