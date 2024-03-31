import {
  Avatar,
  Button,
  Center,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Menu } from "@opengovsg/design-system-react";

import { UserData } from "~types/data";

interface AuthMenuProps {
  user?: UserData | null;
  handleSignOutClick: () => void;
}

export const AuthMenu = ({ user, handleSignOutClick }: AuthMenuProps) => {
  return (
    <Menu isStretch={true}>
      <Menu.Button
        as={Button}
        py={2}
        transition="all 0.3s"
        _focus={{ boxShadow: "none" }}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
        color={"white"}
      >
        <HStack>
          <Avatar
            size={"sm"}
            src={user?.profile_pic}
            name={user?.username}
            referrerPolicy="no-referrer"
          />
          <VStack
            display={{ base: "none", lg: "flex" }}
            alignItems="flex-start"
            spacing="1px"
            ml="2"
          >
            <Text fontSize="sm" color="white">
              {user?.username}
            </Text>
            <Text fontSize="xs" color="white">
              {user?.role}
            </Text>
          </VStack>
        </HStack>
      </Menu.Button>
      <Portal>
        <Menu.List alignItems={"center"} width={"200px"}>
          <br />
          <Center>
            <Avatar
              size={"2xl"}
              src={user?.profile_pic}
              name={user?.username}
              referrerPolicy="no-referrer"
            />
          </Center>
          <br />
          <Center>
            <p>{user?.username}</p>
          </Center>
          <br />
          <Menu.Divider />
          <Menu.Item as="a" href="/profile">
            Profile
          </Menu.Item>
          <Menu.Item onClick={handleSignOutClick}>Logout</Menu.Item>
        </Menu.List>
      </Portal>
    </Menu>
  );
};
