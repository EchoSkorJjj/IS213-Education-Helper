import { Helmet } from "react-helmet-async";
import { FaCheckCircle } from "react-icons/fa";
import {
  Box,
  Button,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Text,
  useToast,
  VStack,
  SimpleGrid,
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
      width={{ base: "90%", md: "70%", lg: "50%" }}
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
      <Box py={12} minHeight="100vh">
      <Helmet>
        <title>Profile</title>
        <meta name="description" content="Profile" />
      </Helmet>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} color="white">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={"gray.500"}>
          You may cancel the subscription at anytime.
        </Text>
      </VStack>
      <SimpleGrid
        columns={{ base: 1, md: 2}}
        spacing={5}
        py={10}
        justifyItems="center"
        alignItems="flex-start"
      >
        <PriceWrapper>
          <Box color="white">
            <Text textAlign='center' fontWeight="500" color="blue.600" fontSize="2xl">
              Free Tier
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" color="black" fontWeight="600">
                $
              </Text>
              <Text fontSize="5xl" color="black" fontWeight="900">
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
              <ListItem>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Flashcard Generation
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Unlock Flashcard in Marketplace
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button
                w="full"
                variant="outline"
                disabled={true}
                isDisabled={true}
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
                color={"white"}
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Most Popular
              </Text>
            </Box>
            <Box py={4} px={12} color="white">
              <Text textAlign='center' color="blue.600" fontWeight="500" fontSize="2xl">
                Pro
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" color="black" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" color="black" fontWeight="900">
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
                  Everything from the Free Tier
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="blue.500" />
                  Quiz Generation
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="blue.500" />
                  Unlock Quiz in Marketplace
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
      </SimpleGrid>
    </Box>
  );
};

export default SubscribePage;
