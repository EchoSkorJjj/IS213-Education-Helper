import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  Heading,
  VStack,
} from "@chakra-ui/react";
import {
  Button,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
} from "@opengovsg/design-system-react";

import { useAuth } from "~features/auth";

import { UpdateProfileType } from "~types/form";

const UpdateProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileType>();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setValue("user_id", user.user_id);
      setValue("username", user.username);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("email", user.email);
    }
  }, []);

  const handleUpdateProfile: SubmitHandler<UpdateProfileType> = (data) => {
    console.log(data);
  };

  return (
    <Box mb="5em" height="100vh">
      <Helmet>
        <title>Update Profile</title>
        <meta name="description" content="Update Profile" />
      </Helmet>
      <Flex
        w="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        pt="10"
        px="10"
        mb="3em"
      >
        <Flex maxW={"6xl"} width="100%" direction="column">
          <Box>
            <IconButton
              aria-label="Back to Profile"
              icon={<ArrowBackIcon />}
              as="a"
              href="/profile"
              color="white"
              variant="ghost"
              mb="5"
            />
          </Box>
          <Heading
            textAlign="center"
            lineHeight={1.1}
            color="white"
            fontSize={{ base: "3xl", sm: "5xl" }}
            mb="3"
          >
            User Profile Edit
          </Heading>
          <Box as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
            <Box mb="10">
              <Avatar
                src={user?.profile_pic}
                name={user?.username}
                size={{ base: "lg", sm: "xl", lg: "2xl" }}
                referrerPolicy="no-referrer"
              />
            </Box>
            <VStack spacing="5" mb="10">
              <FormControl isInvalid={!!errors.username}>
                <FormLabel htmlFor="username" isRequired>
                  Username
                </FormLabel>
                <Input
                  id="username"
                  type="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.first_name}>
                <FormLabel htmlFor="first_name" isRequired>
                  First Name
                </FormLabel>
                <Input
                  id="first_name"
                  type="first_name"
                  {...register("first_name", {
                    required: "First Name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.first_name && errors.first_name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.last_name}>
                <FormLabel htmlFor="last_name" isRequired>
                  Last Name
                </FormLabel>
                <Input
                  id="last_name"
                  type="last_name"
                  {...register("last_name", {
                    required: "Last Name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.last_name && errors.last_name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" isRequired>
                  Email Address
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email address is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <Flex float="right">
              <Button loadingText="Submitting" type="submit">
                Update Profile
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default UpdateProfile;
