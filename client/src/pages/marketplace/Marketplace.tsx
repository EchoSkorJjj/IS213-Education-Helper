import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, useToast } from "@chakra-ui/react";

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
    currentMarketPage: number,
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
    <Box bgGradient="linear(to-t, white 10%, darkBlue.500 90%)">
      <Helmet>
        <title>Marketplace</title>
        <meta name="description" content="Marketplace" />
      </Helmet>
      <MarketHeader />
      <TopicsList
        topics={topics}
        setTopic={setTopic}
        topic={topic}
        setCurrentTopicPage={setCurrentTopicPage}
        currentTopicPage={currentTopicPage}
      />
      <MarketList
        notes={notes}
        setNotesTitle={setNotesTitle}
        setCurrentMarketPage={setCurrentMarketPage}
        currentMarketPage={currentMarketPage}
        totalNotesCount={totalNotesCount}
      />
    </Box>
  );
};

export default MarketplacePage;
