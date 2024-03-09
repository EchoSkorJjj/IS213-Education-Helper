import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Searchbar } from "@opengovsg/design-system-react";

import { Pagination } from "~components/pagination";

interface TopicsProps {
  topics: string[];
  setTopic: (topic: string) => void;
  topic: string;
  setCurrentTopicPage: (pageNumber: number) => void;
  currentTopicPage: number;
}

const TopicsList = ({
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
      w="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt="5"
      px="10"
    >
      <Flex maxW={"6xl"} width="100%" height="90%" direction="column">
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
  );
};

export default TopicsList;
