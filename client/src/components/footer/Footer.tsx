import { Box, Container, Stack, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box color={"darkblue.100"} ml={0}>
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          © {new Date().getFullYear()} EduHelper. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
