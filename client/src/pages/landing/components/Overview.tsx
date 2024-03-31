import {
  Box,
  Heading,
  Container,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import Screenshot from "~assets/img/Macbook_Mockup.png";

const overviewList = [
  {
    id: 1,
    label: "Login Options",
    subLabel: "Login using Gmail or SingPass for secure access.",
  },
  {
    id: 2,
    label: "Navigate to Generator Page",
    subLabel:
      "Upload PDF file and choose your generation type.",
  },
  {
    id: 3,
    label: "Customize Your Notes",
    subLabel:
      "Add a title, topic, and edit your notes.",
  },
  {
    id: 4,
    label: "Submit and Save",
    subLabel:
      "Press submit to generate and save your notes.",
  },
];

const Overview = () => {
  return (
    <Container  maxW={"5xl"} py={10}>
      <Box
        maxW="64rem"
        marginX="auto"
        py={{ base: "3rem", md: "4rem" }}
        px={{ base: "1rem", md: "0" }}
      >
        <Heading
          as="h3"
          fontSize="1.5rem"
          fontWeight="bold"
          textAlign="left"
          mb={{ base: "4", md: "2" }}
          pb={4}
          borderBottom="1px solid"
          borderColor="gray.300"
          >
          How it works
        </Heading>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 0, md: 3 }}
          justifyContent="center"
          alignItems="center"
        >
          <VStack
            spacing={4}
            alignItems="flex-start"
            mb={{ base: 5, md: 0 }}
            maxW="md"
            mr="10"
          >
            {overviewList.map((data) => (
              <Box key={data.id}>
                <HStack spacing={2}>
                  <Flex
                    fontWeight="bold"
                    boxShadow="md"
                    color="white"
                    bg="darkBlue.500"
                    rounded="full"
                    justifyContent="center"
                    alignItems="center"
                    w={10}
                    h={10}
                  >
                    {data.id}
                  </Flex>
                  <Text fontSize="xl">{data.label}</Text>
                </HStack>
                <Text fontSize="md" color="gray.500" ml={12}>
                  {data.subLabel}
                </Text>
              </Box>
            ))}
          </VStack>
          <Box
            borderWidth="1px"
            _hover={{ shadow: 'lg' }}
            rounded="md"
            overflow="hidden"
            bg={useColorModeValue('white', 'gray.800')}
            mt={6}
          >
            <Image
              boxSize={{ base: "auto", md: "lg" }}
              objectFit="cover"
              src={Screenshot}
              rounded="lg"
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default Overview;
