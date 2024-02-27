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
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useAuth } from "~features/auth";

import { getCheckoutUrl } from "~api";

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
      borderColor={"gray.200"}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

const SubscribePage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const handleSubscribe = async () => {
    const url = await getCheckoutUrl();
    window.location.href = url;
  };

  const handleFreePlan = () => {
    const plan = user?.is_paid ? "pro" : "free";
    toast({
      title: `You are already on the ${plan} plan!`,
      status: "info",
      isClosable: true,
      position: "top",
      duration: 3000,
    });
  };

  return (
    <Box py={12} h="100vh" bg="darkBlue.500">
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
          <VStack bg={"gray.50"} py={4} borderBottomRadius={"xl"}>
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
                {user?.is_paid ? "You are on Pro Plan" : "Already on Free Plan"}
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
                Pro
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
            <VStack bg={"gray.50"} py={4} borderBottomRadius={"xl"}>
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
                <Button w="full" onClick={handleSubscribe}>
                  {user?.is_paid ? "Unsubscribe" : "Go Pro"}
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
