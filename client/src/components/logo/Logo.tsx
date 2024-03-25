import React from "react";
import { Heading } from "@chakra-ui/react";
import { Link } from "@opengovsg/design-system-react";

interface LogoProps {
  destination: string;
}

export const Logo: React.FC<LogoProps> = ({ destination }) => {
  return (
    <Link textDecoration={"none"} href={destination}>
      <Heading color="white" textDecoration="none" textDecor={"none"}>
        EduHelper
      </Heading>
    </Link>
  );
};
