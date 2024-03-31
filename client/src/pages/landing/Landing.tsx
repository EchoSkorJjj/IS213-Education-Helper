import { Helmet } from "react-helmet-async";
import { Box } from "@chakra-ui/react";

import Features from "./components/Features";
import Hero from "./components/Hero";
import Overview from "./components/Overview";

const LandingPage = () => {
  return (
    <Box w="100%" overflow="hidden">
      <Helmet>
        <title>EduHelper | Democratise Education</title>
        <meta name="description" content="EduHelper Landing Page" />
      </Helmet>
      <Hero />
      <Features />
      <Overview />
    </Box>
  );
};

export default LandingPage;
