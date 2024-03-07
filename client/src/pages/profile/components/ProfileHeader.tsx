import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";

import { useAuth } from "~features/auth";

const ProfileHeader = () => {
  const { user } = useAuth();

  return (
    <Flex
      w="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt="10"
      px="10"
      mb="3em"
    >
      <Flex
        maxW={"6xl"}
        width="100%"
        direction="row"
        justifyContent="space-between"
      >
        <Flex>
          <Avatar
            src={user?.profile_pic}
            name={user?.username}
            size={{ base: "lg", sm: "xl", lg: "2xl" }}
            referrerPolicy="no-referrer"
          />
          <Flex direction="column" justifyContent="center" ml="5">
            <Text
              color="white"
              fontWeight="bold"
              fontSize={{ base: "1xl", sm: "2xl", lg: "3xl" }}
            >
              {user?.username}
            </Text>
            <Text color="gray.500">{user?.email}</Text>
          </Flex>
        </Flex>
        <Box>
          <Button
            colorScheme="gray"
            border="none"
            as="a"
            href="/profile/update"
          >
            Update Profile
          </Button>
        </Box>
      </Flex>
      {!user?.is_paid && (
        <Flex
          width={{ base: "3xl", lg: "6xl" }}
          w={"full"}
          justifyContent="end"
        >
          <Text color="gray.500" as="a" href="/subscribe">
            This is a free account. Go{" "}
            <Text color="white" fontWeight="bold" as="span">
              pro{" "}
            </Text>
            here!
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ProfileHeader;