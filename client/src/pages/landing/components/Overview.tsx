import {
  Box,
  chakra,
  Container,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
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
    <Container maxW="6xl" py={10}>
      <chakra.h2 fontSize="4xl" fontWeight="bold" textAlign="center" mb={2}>
        How it works?
      </chakra.h2>
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
        >
          {overviewList.map((data) => (
            <Box key={data.id}>
              <HStack spacing={2}>
                <Flex
                  fontWeight="bold"
                  boxShadow="md"
                  color="white"
                  bg="blue.400"
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
        <Image
          boxSize={{ base: "auto", md: "lg" }}
          objectFit="contain"
          src={Screenshot}
          rounded="lg"
        />
      </Stack>
    </Container>
  );
};

export default Overview;
