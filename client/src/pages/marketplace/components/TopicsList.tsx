import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";

import { Topic } from "~shared/types/data";

import { Pagination } from "~components/pagination";

interface TopicsProps {
  topics: Topic[];
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
      bg={"blue.900"}
    >
      <Flex maxW={"6xl"} width="100%" height="90%" direction="column">
        <Box width="100%" mb={10}>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
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
          </Flex>
          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 4 }}
            spacing={10}
            paddingTop="5"
            paddingBottom="39.5"
            mb={10}
          >
            {currentTopics.map(({ value, label }) => (
              <Button
                as="button"
                p="2"
                bg={topic === value ? "blue.700" : "blue.600"}
                _hover={{ bg: topic === value ? "blue.500" : "blue.400" }}
                size="lg"
                key={value}
                onClick={() => setTopic(value)}
                rounded="none"
                height="150%"
                justifyContent="flex-start"
                border={0}
              >
                {label}
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
