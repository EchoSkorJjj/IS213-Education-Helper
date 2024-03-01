import { FaCheckCircle } from "react-icons/fa";
import {
  Box,
  Button,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useAuth } from "~features/auth";

interface Props {
  children: React.ReactNode;
}

function PriceWrapper(props: Props) {
  const { children } = props;

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

const SubscribePage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const handleFreePlan = () => {
    toast({
      title: "You are already on the free plan!",
      status: "info",
      isClosable: true,
      position: "top",
    });
  };

  return (
    <Box py={12} h="100vh">
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl" color="white">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          You may cancel the subscription at anytime.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        <PriceWrapper>
          <Box py={4} px={12} color="white">
            <Text fontWeight="500" fontSize="2xl">
              Free
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                $
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                0
              </Text>
              <Text fontSize="3xl" color="gray.500">
                /month
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue("gray.50", "gray.700")}
            py={4}
            borderBottomRadius={"xl"}
          >
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Notes Generation
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Access to Marketplace
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button
                w="full"
                variant="outline"
                disabled={true}
                onClick={() => handleFreePlan()}
              >
                Free Plan
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <Text
                textTransform="uppercase"
                bg={"blue.500"}
                px={3}
                py={1}
                color={"gray.900"}
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Most Popular
              </Text>
            </Box>
            <Box py={4} px={12} color="white">
              <Text fontWeight="500" fontSize="2xl">
                Growth
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  1
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue("gray.50", "gray.700")}
              py={4}
              borderBottomRadius={"xl"}
            >
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="blue.500" />
                  Notes Generation
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="blue.500" />
                  Access to Marketplace
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="blue.500" />
                  Flashcard / Quiz Generation
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="blue.500" />
                  Unlock Flashcard / Quiz in Marketplace
                </ListItem>
              </List>
              <Box w="80%" pt={7}>
                <Button w="full" >
                  {user?.is_paid ? "Already a Pro" : "Go Pro"}
                </Button>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
      </Stack>
    </Box>
  );
};

export default SubscribePage;
