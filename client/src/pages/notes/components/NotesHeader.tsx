import { Flex, Stack, Text } from "@chakra-ui/react";

import NotesPageImage from "~assets/img/notes_page_image.png";

const NotesHeader = () => {
  return (
    <Flex
      w="100%"
      h={{ base: "20vh", md: "40vh" }}
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
          color={"midBlue.500"}
          lineHeight={1.2}
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
        >
          <Text as="span" fontWeight="bold">
            Notes
          </Text>
          <br />
          <Text as="span" fontWeight="bold">
            Generator
          </Text>
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
          backgroundImage={NotesPageImage}
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
              <Text as="span" fontWeight="bold">
                Notes
              </Text>
              <br />
              <Text as="span" fontWeight="bold">
                Generator
              </Text>
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NotesHeader;
