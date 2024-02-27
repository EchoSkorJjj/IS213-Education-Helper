import { Box, Flex, Stack, Text, useBreakpointValue } from "@chakra-ui/react";

import LandingPageImage from "~assets/img/landing_page_image.png";

const LandingPage = () => {
  return (
    <Flex direction="column" h="100vh">
      <Flex flex="45%" bg="darkBlue.500" align="center" justify="center">
        <Stack
          w={"full"}
          justify={"end"}
          textAlign={"center"}
          mt={{ base: 6, md: "none" }}
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
        <Box
          position="relative"
          height="100%"
          width="100%"
          display={{ base: "none", md: "flex" }}
        >
          <Flex
            width={{ base: "3xl", lg: "6xl" }}
            h={"100%"}
            backgroundImage={LandingPageImage}
            backgroundSize={"cover"}
            backgroundPosition={"center center"}
            position="absolute"
            bottom="0"
            left={{ md: "50%" }}
            transform={useBreakpointValue({
              base: "translate(0%, 35%)",
              md: "translate(-50%, 10%)",
            })}
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
        </Box>
      </Flex>
      <Flex flex="55%" bg="white" align="center" justify="center">
        <Box position="relative" height="100%" width="100%"></Box>
      </Flex>
    </Flex>
  );
};

export default LandingPage;
