import { Box, HStack } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  href: string;
}

export const AuthLinks = [
  { name: "Home", href: "/home" },
  { name: "Generator", href: "/generator" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Profile", href: "/profile" },
];

export const Links = [{ name: "Login", href: "/login" }];

export const NavItem = ({ children, href }: Props) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: "gray.600",
      }}
      href={href}
    >
      {children}
    </Box>
  );
};

export const NavLink = () => {
  return (
    <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
      {AuthLinks.map((link) => (
        <NavItem key={link.name} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </HStack>
  );
};
