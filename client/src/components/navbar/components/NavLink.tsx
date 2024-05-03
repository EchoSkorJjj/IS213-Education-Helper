import { NavLink as RouterLink } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  href: string;
}

export const AuthLinks = [
  { name: "Generator", href: "/generator" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Your Notes", href: "/inventory" },
  { name: "Pricing", href: "/subscribe" },
  { name: "Our Story", href: "/about" },
];

export const NonAuthLinks = [{ name: "Our Story", href: "/about" }];

export const Links = [{ name: "Login", href: "/login" }];

export const NavItem = ({ children, href }: Props) => {
  return (
    <Box
      as={RouterLink}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: "gray.600",
      }}
      to={href}
    >
      {({ isActive }: { isActive: boolean }) => (
        <Box
          color={isActive ? "white" : "gray.300"}
          _hover={{
            color: "white",
          }}
          fontWeight={isActive ? "bold" : ""}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export const NavLink = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
      {isAuthenticated
        ? AuthLinks.map((link) => (
            <NavItem key={link.name} href={link.href}>
              {link.name}
            </NavItem>
          ))
        : NonAuthLinks.map((link) => (
            <NavItem key={link.name} href={link.href}>
              {link.name}
            </NavItem>
          ))}
    </HStack>
  );
};
