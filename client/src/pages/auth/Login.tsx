import { Helmet } from "react-helmet-async";
import { FcGoogle } from "react-icons/fc";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

import MyInfoLogo from "~assets/img/singpass/Primary@2x.png";
import SgIDLogo from "~assets/img/singpass/sgid_logo.png";
import SingPassLogo from "~assets/img/singpass/singpass_logo_fullcolours-1.png";

import { useAuth } from "~features/auth";

const LoginPage = () => {
  const { sgIdGetAuthUrl, myInfoGetCode, googleAuth } = useAuth();

  return (
    <Flex minH="100vh" align="center" justify="center" bg={"darkBlue.500"}>
      <Helmet>
        <title>Sign in</title>
        <meta name="description" content="Sign in" />
      </Helmet>
      <Stack
        spacing={8}
        mx="auto"
        maxW="lg"
        w={{ base: "90%", sm: "full" }}
        p={1}
      >
        <Box rounded="lg" bg={"white"} boxShadow="lg" p={8}>
          <Stack align="center" mt="5" mb="10">
            <Heading fontSize="3xl" color={"black"}>
              Sign in
            </Heading>
          </Stack>
          <Stack spacing={6} alignItems="center" mb="6">
            <Button
              w={{ base: "full", sm: "80%" }}
              size="lg"
              variant="outline"
              colorScheme="google"
              leftIcon={<FcGoogle />}
              onClick={googleAuth}
            >
              <Center>
                <Text>Sign in with Google</Text>
              </Center>
            </Button>
            <Button
              w={{ base: "full", sm: "80%" }}
              variant="outline"
              bg="white"
              colorScheme="black"
              size="lg"
              leftIcon={<Image src={SgIDLogo} boxSize="60px" height="30px" />}
              rightIcon={
                <Image src={SingPassLogo} boxSize="100px" height="20px" />
              }
              onClick={sgIdGetAuthUrl}
            />
            <IconButton
              aria-label="myinfo"
              border="none"
              size="lg"
              icon={<Image src={MyInfoLogo} boxSize="100%" objectFit="cover" />}
              onClick={myInfoGetCode}
              w={{ base: "full", sm: "80%" }}
            />
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
