import { Avatar, Flex, Text } from "@chakra-ui/react";

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
      bg="darkBlue.500"
    >
      <Flex
        maxW={"6xl"}
        width="100%"
        direction="row"
        justifyContent="space-between"
        mb={user?.is_paid ? "10" : "0"}
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
              mb="5"
            >
              {user?.username}
            </Text>
            <Text mt="-19" color="gray.500">
              {user?.email}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {!user?.is_paid && (
        <Flex
          width={{ base: "3xl", lg: "6xl" }}
          w={"full"}
          justifyContent="end"
        >
          <Text color="gray" as="a" href="/subscribe" mb="10">
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
