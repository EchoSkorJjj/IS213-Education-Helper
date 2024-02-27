import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Searchbar } from "@opengovsg/design-system-react";

import MarketplaceImage from "~assets/img/marketplace_image.png";
import { Pagination } from "~components/pagination";

interface TopicsProps {
  topics: string[];
  setTopic: (topic: string) => void;
  topic: string;
  setCurrentTopicPage: (pageNumber: number) => void;
  currentTopicPage: number;
}

const Topics = ({
  topics,
  setTopic,
  topic,
  setCurrentTopicPage,
  currentTopicPage,
}: TopicsProps) => {
  const pageSize = 8;

  const indexOfLastTopic = currentTopicPage * pageSize;
  const indexOfFirstTopic = indexOfLastTopic - pageSize;
  const currentTopics = topics.slice(indexOfFirstTopic, indexOfLastTopic);

  return (
    <Flex
      direction="column"
      h="70vh"
      overflowX={{ base: "hidden", lg: "visible" }}
    >
      <Flex
        height={{ base: "", md: "37%" }}
        bg="darkBlue.500"
        align="center"
        justify="center"
      >
        <Stack
          w={"full"}
          justify={"end"}
          textAlign={"center"}
          mt={{ base: 6, md: "none" }}
          px={{ base: 4, md: 8 }}
          display={{ base: "flex", md: "none" }}
        >
          <Text
            color={"white"}
            lineHeight={1.2}
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          >
            <Text as="span" fontWeight="bold">
              Notes
            </Text>
            <br />
            <Text as="span" fontWeight="bold">
              Marketplace
            </Text>
          </Text>
        </Stack>
        <Box
          position="relative"
          height="100%"
          width="100%"
          display={{ base: "none", md: "flex" }}
        >
          <Flex
            width={{ base: "3xl", lg: "6xl" }}
            h={"100%"}
            backgroundImage={MarketplaceImage}
            backgroundSize={"cover"}
            backgroundPosition={"center center"}
            position="absolute"
            bottom="0"
            left={{ md: "50%" }}
            transform={useBreakpointValue({
              base: "translate(0%, 35%)",
              md: "translate(-50%, 10%)",
            })}
          >
            <Stack
              w={"full"}
              justify={"end"}
              textAlign={"start"}
              mt={{ base: 6, md: "none" }}
              px={{ base: 4, md: 8 }}
            >
              <Text
                pl={{ base: 11 }}
                pb={{ base: 11 }}
                color={"white"}
                lineHeight={1.2}
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              >
                <Text as="span" fontWeight="bold">
                  Notes
                </Text>
                <br />
                <Text as="span" fontWeight="bold">
                  Marketplace
                </Text>
              </Text>
            </Stack>
          </Flex>
        </Box>
      </Flex>
      <Flex
        bg="midBlue.500"
        height={{ base: "", md: "63%" }}
        justify="center"
        pt={{ base: "5", md: "2" }}
        pb="10"
        px="10"
      >
        <Flex
          maxW={"6xl"}
          mt={{ md: "4em" }}
          width="100%"
          height="90%"
          direction="column"
        >
          <Box width="100%">
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Text
                  color="white"
                  fontSize={{ base: "2xl", md: "5xl", lg: "7xl" }}
                  fontWeight="bold"
                >
                  Topics
                </Text>
              </Box>
              <Box>
                <Searchbar
                  placeholder="Search topics"
                  style={{
                    bg: "black",
                  }}
                  onSearch={(value: string) => {
                    setTopic(value);
                  }}
                  isExpanded={true}
                />
              </Box>
            </Flex>
            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              spacing={5}
              paddingTop="5"
              paddingBottom="5"
            >
              {currentTopics.map((currentTopic) => (
                <Button
                  as="button"
                  bg={topic === currentTopic ? "blue.300" : "lightBlue.500"}
                  size="lg"
                  key={currentTopic}
                  onClick={() => setTopic(currentTopic)}
                >
                  {currentTopic}
                </Button>
              ))}
            </SimpleGrid>
            <Pagination
              color="white"
              isDisabled={topics.length === 0}
              totalCount={topics.length}
              pageSize={pageSize}
              currentPage={currentTopicPage}
              onPageChange={setCurrentTopicPage}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Topics;
