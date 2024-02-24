import { Box, Flex, Image, Stack, Text, VStack } from "@chakra-ui/react";

import LandingPageImage from "~assets/img/landing_page_image.png";

const LandingPage = () => {
  return (
    <Flex direction="column" h="100vh">
      <Flex flex="45%" bg="darkBlue.500" align="center" justify="center">
        <Box position="relative" height="100%" width="100%">
          <Image
            src={LandingPageImage}
            width={{ base: "3xl", md: "6xl" }}
            position="absolute"
            display={{ base: "none", md: "flex" }}
            bottom="0"
            left={{ md: "50%" }}
            transform={{
              base: "translate(0%, 35%)",
              md: "translate(-50%, 10%)",
            }}
            alt="Centered Image"
          />
          <VStack
            w={"full"}
            position="absolute"
            transform={{ md: "translate(-15%, 370%)" }}
            justify={"center"}
            mt={{ base: 6, md: "none" }}
            px={{ base: 4, md: 8 }}
          >
            <Stack maxW={"2xl"} align={"flex-start"} spacing={6}>
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
          </VStack>
        </Box>
      </Flex>
      <Flex flex="55%" bg="white" align="center" justify="center">
        <Box position="relative" height="100%" width="100%"></Box>
      </Flex>
    </Flex>
  );
};

export default LandingPage;
