import { Helmet } from "react-helmet-async";
// Here we have used react-icons package for the icon
import { FaQuoteRight } from "react-icons/fa";
import {
  Avatar,
  Box,
  chakra,
  Container,
  Flex,
  Icon,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import jihoonImage from "./jihoon.jpg";
import louisImage from "./louis.jpg";
import neilImage from "./neil.jpg";
import sdgImage from "./sdg.jpg";
import thadImage from "./thad.jpeg";
import ztImage from "./zt.jpg";

const data = {
  heading: "Inspired by UN Sustainable Development Goals",
  subHeading: "SDG 4: Quality Education",
  features: [
    "Progress towards quality education was already slower than required before the pandemic, but COVID-19 has had devastating impacts on education, causing learning losses in four out of five of the 104 countries studied.",
    "Without additional measures, only one in six countries will achieve the universal secondary school completion target by 2030, an estimated 84 million children and young people will still be out of school, and approximately 300 million students will lack the basic numeracy and literacy skills necessary for success in life.",
    "To achieve national Goal 4 benchmarks, which are reduced in ambition compared with the original Goal 4 targets, 79 low- and lower-middle- income countries still face an average annual financing gap of $97 billion.",
    "To deliver on Goal 4, education financing must become a national investment priority. Furthermore, measures such as making education free and compulsory, increasing the number of teachers, improving basic school infrastructure and embracing digital transformation are essential.",
  ],
};

interface TestimonialAttributes {
  username: string;
  position: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: TestimonialAttributes[] = [
  {
    username: "Ji Hoon",
    position: "Full Stack Engineer",
    company: "SMU",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    content: `As SMU students, we witnessed diverse dreams and ambitions. This app is our tribute to endless possibilities, a platform where every learner finds their path to greatness.`,
  },
  {
    username: "Zheng Ting",
    position: "Full Stack Engineer",
    company: "SMU",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    content: `Nights at the library, coffee in hand, the idea was born. We longed to make education accessible, to turn the daunting into the achievable for every student.`,
  },
  {
    username: "Thaddeaus Low",
    position: "Frontend Engineer",
    company: "SMU",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    content: `Our journey at SMU showed us the power of community. This app is our effort to extend that community beyond campus, making learning a shared, vibrant experience.`,
  },
  {
    username: "Neil Sharma",
    position: "Backend Engineer",
    company: "SMU",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    content: `Struggling through classes, we realized the gap in our educational system. This app was our answer—personalized, engaging, a bridge between learners and their dreams.`,
  },
  {
    username: "Louis Teo",
    position: "Frontend Engineer",
    company: "SMU",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    content: `Inspired by our own challenges and triumphs at SMU, we envisioned a tool that empowers, educates, and connects. A testament to our love for learning, crafted for all.`,
  },
];

const About = () => {
  return (
    <Box minH="100vh" w="100%">
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Home" />
      </Helmet>

      {/* Our Mission */}
      <Container maxW="10xl" p={{ base: 8, sm: 20 }}>
        <Stack direction="column" spacing={9} alignItems="center">
          <chakra.h1
            fontSize={{ base: "4xl", sm: "5xl" }}
            fontWeight="bold"
            textAlign="center"
            maxW="600px"
          >
            We're on a mission to make learning{" "}
            <chakra.span
              color="midBlue.500"
              bg="linear-gradient(transparent 50%, #EBF8FF 50%)"
            >
              accessible for everyone.
            </chakra.span>
          </chakra.h1>
          <Text maxW="550px" fontSize="xl" textAlign="center" color="gray.500">
            EduHelper helps you learn about anything you want, at your own pace.
            We believe that everyone should have access to education, regardless
            of their background.
          </Text>
        </Stack>
      </Container>

      {/* UN Goal */}
      <Container maxW="5xl" p={{ base: 5, md: 10 }}>
        <Flex
          boxShadow={useColorModeValue(
            "0 4px 6px rgba(160, 174, 192, 0.6)",
            "0 4px 6px rgba(9, 17, 28, 0.9)",
          )}
          backgroundSize="cover"
          backgroundImage={`url(${sdgImage})`}
          p={{ base: 4, sm: 8 }}
          rounded="lg"
        >
          <Stack direction="column" spacing={1} textAlign="left" flexGrow={3}>
            <chakra.h1 fontSize="xl" fontWeight="bold" color="white">
              {data.heading}
            </chakra.h1>
            <chakra.h1
              fontSize="4xl"
              lineHeight={1.2}
              fontWeight="bold"
              color="white"
            >
              {data.subHeading}
            </chakra.h1>
            <List spacing={3} color="white" my={5}>
              {data.features.map((feature, index) => (
                <ListItem key={index}>{feature}</ListItem>
              ))}
            </List>
            <Link
              href="https://www.un.org/sustainabledevelopment/education/"
              isExternal
              alignItems="center"
              justifyContent="center"
              fontSize="md"
              fontWeight="500"
              p={3}
              lineHeight={1.2}
              h={10}
              w="max-content"
              rounded="md"
              textDecoration="none"
              color="white"
              bg="blackAlpha.800"
              shadow="lg"
              _hover={{ textDecoration: "none" }}
            >
              Click here to learn more
            </Link>
          </Stack>
        </Flex>
      </Container>

      {/* Testimonials */}
      <Container maxW="8xl" p={{ base: 5, md: 10 }}>
        <Stack direction="column" alignItems="center">
          <chakra.h1
            fontSize={{ base: "4xl", sm: "5xl" }}
            fontWeight="bold"
            textAlign="center"
            maxW="600px"
            mb={8}
            color="midBlue.500"
          >
            Our Team
          </chakra.h1>
        </Stack>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
          spacing="20px"
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
        >
          {testimonials.map((testimonial, index) => (
            <Flex justifyContent="center" key={index}>
              <Box
                maxW="25rem"
                w="full"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={{ base: 4, sm: 8 }}
                bg={useColorModeValue("white", "blackAlpha.600")}
                borderTop="2px solid"
                borderColor="midBlue.500"
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
                boxShadow="lg"
                m="0 auto"
              >
                <Icon as={FaQuoteRight} w={8} h={8} color="midBlue.500" />
                <Text p={5} color="gray.500" textAlign={"center"}>
                  {testimonial.content}
                </Text>
                <VStack alignItems="center">
                  <Avatar
                    name={testimonial.username}
                    src={
                      testimonial.username === "Thaddeaus Low"
                        ? thadImage
                        : testimonial.username === "Louis Teo"
                          ? louisImage
                          : testimonial.username === "Neil Sharma"
                            ? neilImage
                            : testimonial.username === "Zheng Ting"
                              ? ztImage
                              : testimonial.username === "Ji Hoon"
                                ? jihoonImage
                                : testimonial.image // Fallback to the image URL in the array
                    }
                    size="lg"
                  />
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">
                      {testimonial.username}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                      {testimonial.position} at {testimonial.company}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default About;
