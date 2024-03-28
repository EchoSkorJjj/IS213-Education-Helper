import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, useToast, VStack } from "@chakra-ui/react";

import MarketHeader from "./components/MarketHeader";
import MarketList from "./components/MarketList";
import TopicsList from "./components/TopicsList";

import { getTopics } from "~api";
import { getNotes } from "~util";

interface NotesProp {
  unique_id: string;
  topic: string;
  title: string;
  imageURL: string;
  creator: string;
}

const MarketplacePage = () => {
  const toast = useToast();

  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>("All");
  const [notesTitle, setNotesTitle] = useState<string>("");
  const [notes, setNotes] = useState<NotesProp[]>([]);
  const [totalNotesCount, setTotalNotesCount] = useState<number>(1);

  const [currentTopicPage, setCurrentTopicPage] = useState(1);
  const [currentMarketPage, setCurrentMarketPage] = useState(1);

  const handleGetNotes = async (
    topic: string,
    notesTitle: string,
    currentMarketPage: number
  ): Promise<void> => {
    const data = await getNotes(topic, notesTitle, currentMarketPage);

    setNotes(data.notes);
    setTotalNotesCount(data.totalNotesCount);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await getTopics();
      if (!fetchedTopics || fetchedTopics.length === 0) {
        toast({
          title: "Failed to fetch topics",
          status: "error",
          isClosable: true,
          position: "top",
          duration: 3000,
        });
        return;
      }
      setTopics(fetchedTopics);
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    handleGetNotes(topic, notesTitle, currentMarketPage);
  }, [topic, notesTitle, currentMarketPage]);

  return (
    <VStack spacing={0} minHeight="100vh" h="1800">
      <Box bg={"darkBlue.500"} w="100%" h="350">
        <Helmet>
          <title>Marketplace</title>
          <meta name="description" content="Marketplace" />
        </Helmet>
        <MarketHeader />

        <Box bg="blue.800" w="100%" h="400">
          <TopicsList
            topics={topics}
            setTopic={setTopic}
            topic={topic}
            setCurrentTopicPage={setCurrentTopicPage}
            currentTopicPage={currentTopicPage}
          />
        </Box>
        <Box h="450">
          <MarketList
            notes={notes}
            setNotesTitle={setNotesTitle}
            setCurrentMarketPage={setCurrentMarketPage}
            currentMarketPage={currentMarketPage}
            totalNotesCount={totalNotesCount}
          />
        </Box>
      </Box>
    </VStack>
  );
};
export default MarketplacePage;
