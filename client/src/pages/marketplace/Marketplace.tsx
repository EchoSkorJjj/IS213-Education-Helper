import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { fetchNotes } from "./generateNote";
import Market from "./Market";
import Topics from "./Topics";

interface NotesProp {
  topic: string;
  title: string;
  imageURL: string;
  creator: string;
}

const MarketplacePage = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>("All");
  const [notesTitle, setNotesTitle] = useState<string>("");
  const [notes, setNotes] = useState<NotesProp[]>([]);
  const [totalNotesCount, setTotalNotesCount] = useState<number>(1);

  const [currentTopicPage, setCurrentTopicPage] = useState(1);
  const [currentMarketPage, setCurrentMarketPage] = useState(1);

  const getNotes = async (
    topic: string,
    notesTitle: string,
    currentMarketPage: number,
  ): Promise<void> => {
    const { notes, totalNotesCount } = await fetchNotes(
      topic,
      notesTitle,
      currentMarketPage,
    );

    setNotes(notes);
    setTotalNotesCount(totalNotesCount);
  };

  useEffect(() => {
    // Simulate fetching topics names
    const fetchedTopics = [
      "All",
      "Data Science",
      "Business & Management",
      "Language",
      "Information Technology",
      "Film & Media",
      "Math & Logic",
      "Health & Medical",
      "Design & Creative",
      "Neil deGrasse Tyson",
      "Neil sharma",
      "Neil Gae",
    ];

    setTopics(fetchedTopics);
  }, []);

  useEffect(() => {
    getNotes(topic, notesTitle, currentMarketPage);
  }, [topic, notesTitle, currentMarketPage]);

  return (
    <Box>
      <Topics
        topics={topics}
        setTopic={setTopic}
        topic={topic}
        setCurrentTopicPage={setCurrentTopicPage}
        currentTopicPage={currentTopicPage}
      />
      <Market
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
