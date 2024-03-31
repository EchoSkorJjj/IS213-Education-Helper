import Typewriter from "react-ts-typewriter";
import {
  Box,
  Button,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box pb={8}>
      <Stack
        pos="relative"
        bgGradient={`linear(to-l, blue.500, blue.400 , cyan.400)`}
        height="250px"
        w="100%"
      ></Stack>
      <Box
        maxW="3xl"
        p={4}
        isolation="isolate"
        zIndex={3}
        mt="-10rem"
        marginInline="auto"
      >
        <Box
          boxShadow={useColorModeValue(
            "0 4px 6px rgba(160, 174, 192, 0.6)",
            "0 4px 6px rgba(9, 17, 28, 0.9)",
          )}
          bg={useColorModeValue("white", "gray.800")}
          p={{ base: 4, sm: 8 }}
          overflow="hidden"
          rounded="2xl"
        >
          <Stack
            pos="relative"
            zIndex={1}
            direction="column"
            spacing={5}
            textAlign="left"
            display={"flex"}
            justifyContent={"center"}
            align={"center"}
          >
            <Box textAlign="center" color="midBlue.500">
              <Text fontSize={{ base: "4xl", sm: "5xl" }} fontWeight="bold">
                Create accessible notes with speed
              </Text>
              <Text textAlign="center" fontSize="xl">
                By{" "}
                <Text as="span" color="blue.300">
                  {" "}
                  democratising education
                </Text>
                , we{" "}
                <Text as="span" color="blue.300">
                  empower
                </Text>{" "}
                you to learn&nbsp;
              </Text>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={8}
              >
                <Text fontSize="xl">
                  <Typewriter
                    text={[
                      "what you love",
                      "Data Science",
                      "Philosophy",
                      "History",
                      "Literature",
                      "Medicine",
                    ]}
                    loop={true}
                    delay={1000}
                    speed={80}
                  />
                </Text>
              </Box>
              <Link href="/login">
                <Button colorScheme="blue" size="lg">
                  Begin your learning now!
                </Button>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
