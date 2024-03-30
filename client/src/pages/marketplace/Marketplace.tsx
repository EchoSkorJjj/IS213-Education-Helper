import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, useToast } from "@chakra-ui/react";

import MarketHeader from "./components/MarketHeader";
import MarketList from "./components/MarketList";
import TopicsList from "./components/TopicsList";

import { getTopics, getNotes } from "~api";

import { NotePreview, Topic } from "~types/data";

import { useAuth } from "~features/auth";

const MarketplacePage = () => {
  const toast = useToast();
  const { authorization } = useAuth();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [notesTitle, setNotesTitle] = useState<string>("");
  const [notes, setNotes] = useState<NotePreview[]>([]);
  const [totalNotesCount, setTotalNotesCount] = useState<number>(1);

  const [currentTopicPage, setCurrentTopicPage] = useState(1);
  const [currentMarketPage, setCurrentMarketPage] = useState(1);

  const handleSetTopic = (topic: string) => {
    if (topic === "all") {
      setTopic("");
    } else {
      setTopic(topic);
    }
    setCurrentMarketPage(1);
  }

  const handleGetNotes = async (
    topic: string,
    notesTitle: string,
    currentMarketPage: number,
  ): Promise<void> => {
    if (!authorization) return;
    const data = await getNotes(topic, notesTitle, currentMarketPage, authorization);
    if (!data) {
      toast({
        title: "No notes found",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setNotes([]);
      setTotalNotesCount(0);
      return;
    }
    setNotes(data.notes);
    setTotalNotesCount(data.count);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await getTopics();
      if (!fetchedTopics || fetchedTopics.length === 0) {
        toast({
          title: "Failed to fetch topics",
          status: "error", 
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
    <Box>
      <Helmet>
        <title>Marketplace</title>
        <meta name="description" content="Marketplace" />
      </Helmet>
      <MarketHeader />

      <Box w="100%">
        <TopicsList
          topics={topics}
          setTopic={handleSetTopic}
          topic={topic}
          setCurrentTopicPage={setCurrentTopicPage}
          currentTopicPage={currentTopicPage}
        />
      </Box>
      <Box>
        <MarketList
          notes={notes}
          topics={topics}
          notesTitle={notesTitle}
          setNotesTitle={setNotesTitle}
          setCurrentMarketPage={setCurrentMarketPage}
          currentMarketPage={currentMarketPage}
          totalNotesCount={totalNotesCount}
        />
      </Box>
    </Box>
  );
};
export default MarketplacePage;
