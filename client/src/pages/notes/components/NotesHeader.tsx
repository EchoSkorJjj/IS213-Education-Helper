import { Flex, Stack, Text } from "@chakra-ui/react";

import NotesPageImage from "~assets/img/notes_page_image.png";

const NotesHeader = () => {
  return (
    <Flex
      w="100%"
      h={{ base: "40vh", md: "40vh" }}
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt={{ md: "5" }}
      bg="darkBlue.500"
    >
      <Flex
        display={{ base: "flex", md: "none" }}
        width="100%"
        height="100%"
        backgroundImage={NotesPageImage}
        backgroundSize="cover"
        backgroundPosition="center center"
      >
        <Stack
          w="100%"
          justify="center"
          textAlign="center"
          px={4}
          pb={8}
          bgColor="rgba(0, 0, 0, 0.6)"
        >
          <Text
            color="white"
            lineHeight={1.2}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
          >
            Notes
            <br />
            Generator
          </Text>
        </Stack>
      </Flex>
      <Flex
        display={{ base: "none", md: "flex" }}
        width={{ md: "3xl", lg: "6xl" }}
        height="100%"
        backgroundImage={NotesPageImage}
        backgroundSize="cover"
        backgroundPosition="center center"
      >
        <Stack
          w="full"
          justify="end"
          textAlign="start"
          px={{ md: 8 }}
          pb={{ md: 11 }}
        >
          <Text
            color="white"
            lineHeight={1.2}
            fontSize={{ md: "4xl", lg: "5xl" }}
            fontWeight="bold"
          >
            Notes
            <br />
            Generator
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default NotesHeader;
