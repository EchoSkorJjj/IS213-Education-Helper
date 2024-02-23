import { FiChevronDown } from "react-icons/fi";
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

import avatar4 from "~assets/img/avatars/avatar4.png";

import { UserData } from "~types/data";

interface AuthMenuProps {
  user?: UserData | null;
  handleSignOutClick: () => void;
}

export const AuthMenu = ({ user, handleSignOutClick }: AuthMenuProps) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        py={2}
        transition="all 0.3s"
        _focus={{ boxShadow: "none" }}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <HStack>
          <Avatar size={"sm"} src={avatar4} referrerPolicy="no-referrer" />
          <VStack
            display={{ base: "none", lg: "flex" }}
            alignItems="flex-start"
            spacing="1px"
            ml="2"
          >
            <Text fontSize="sm">{user?.username}</Text>
            <Text fontSize="xs" color="gray.600">
              {user?.role}
            </Text>
          </VStack>
          <Box display={{ base: "none", lg: "flex" }}>
            <FiChevronDown />
          </Box>
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList alignItems={"center"}>
          <br />
          <Center>
            <Avatar size={"2xl"} src={avatar4} referrerPolicy="no-referrer" />
          </Center>
          <br />
          <Center>
            <p>{user?.username}</p>
          </Center>
          <br />
          <MenuDivider />
          <MenuItem as="a" href="/profile">
            Profile Settings
          </MenuItem>
          <MenuItem onClick={handleSignOutClick}>Logout</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
