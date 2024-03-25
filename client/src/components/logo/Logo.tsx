import React from "react";
import { Heading, Link } from "@chakra-ui/react";

interface LogoProps {
  destination: string;
}

export const Logo: React.FC<LogoProps> = ({ destination }) => {
  return (
    <Link href={destination}>
      <Heading color="white" style={{textDecoration: "none"}}>
        EduHelper
      </Heading>
    </Link>
  );
};
