import { Helmet } from "react-helmet-async";
import { Box, Flex, Text, Button, Link } from "@chakra-ui/react";
import SkyLineVideo from "~assets/SkylineVideo.mp4";
import ReactPlayer from 'react-player';
import Typewriter from "react-ts-typewriter";

const LandingPage = () => {
  return (
    <Box w="100%" h="100vh" position="relative" overflow="hidden">
      <Helmet>
        <title>EduHelper | Democratise Education</title>
        <meta name="description" content="EduHelper Landing Page" />
      </Helmet>
      <Box position="absolute" top={0} left={0} w="100%" h="100%">
        <ReactPlayer
          url={SkyLineVideo}
          playing={true}
          loop={true}
          muted={true}
          width="100.68%"
          height="114%"
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="blackAlpha.500"
        />
      </Box>
      <Flex
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="center"
        position="relative"
        zIndex={3}
      >
        <Box textAlign="center" color="white">
          <Text fontSize={{ base: "4xl", md: "80px" }} fontWeight="bold" >EduHelper</Text>
          <Text textAlign='center' fontSize={{ base: "2xl", md: "4xl" }}>
            By <Text as="span" color="blue.300"> democratising education</Text>, 
          </Text>
          <Text textAlign="left" fontSize={{ base: "2xl", md: "4xl" }} mb={8}>
            we <Text as="span" color="blue.300">empower</Text> you to learn&nbsp;
            <Box display="inline-block" width="250px">
              <Typewriter text={["what you love", "Data Science", "Philosophy", "History", "Literature", "Medicine"]} loop={true} speed={80} />
            </Box>
          </Text>
        <Link href="/login">
          <Button colorScheme="blue" size="lg">
            Begin your learning now!
          </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default LandingPage;