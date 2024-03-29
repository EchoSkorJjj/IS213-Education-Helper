import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBackIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";

import {
  ContentType,
  FlashcardType,
  MultipleChoiceQuestion,
} from "~shared/types/data";

import { useAuth } from "~features/auth";

import Flashcard from "./components/Flashcard";
import MCQ from "./components/MCQ";

import { deleteNote, getContent, saveNotes } from "~api";

function ViewNotes() {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>();
  const [content, setContent] = useState<ContentType>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string>();
  const { user } = useAuth();
  const userId = user?.user_id;
  const { authorization } = useAuth();
  const [ownerId, setOwnerId] = useState<string>();
  const [noteTitle, setNoteTitle] = useState<string>();
  const [noteTopic, setNoteTopic] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const deleteSavedCard = async () => {
    if (!noteId || !authorization) {
      return;
    }
    deleteNote(authorization, noteId);
  };

  const saveCardsSet = async () => {
    if (!noteId || !authorization) {
      return;
    }
    saveNotes(authorization, noteId);
  };

  const extractFileData = (fileContent: string) => {
    const byteCharacters = atob(fileContent);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0),
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };

  const setFileHook = (data: any) => {
    setContent(data.associated_contents);
    setOwnerId(data.note.user_id);
    setNoteTitle(data.note.title);
    setNoteTopic(data.note.topic);
    setFileName(data.note.file_name);
  };

  const setNoteData = (data: any) => {
    setFileHook(data);
    const fileContent = data.note.file_content;

    const blobUrl = URL.createObjectURL(extractFileData(fileContent));
    setBlobUrl(blobUrl);
  };

  const handleGetContent = async () => {
    if (!noteId || !authorization) {
      return;
    }

    const data = await getContent(noteId, authorization);

    if (!data) {
      return;
    }

    setNoteData(data);
  };

  const getCards = (contents: ContentType) => {
    const flashcards = Array.isArray(contents.flashcards)
      ? contents.flashcards
      : [];
    const mcqs = Array.isArray(contents.mcqs) ? contents.mcqs : [];

    return [
      ...flashcards.map((flashcard: FlashcardType) => ({
        ...flashcard,
        type: "flashcard",
      })),
      ...mcqs.map((mcq: MultipleChoiceQuestion) => ({
        ...mcq,
        type: "mcq",
      })),
    ];
  };

  useEffect(() => {
    handleGetContent();
  }, [noteId]);

  const cards = content ? getCards(content) : [];

  const totalCards = cards.length;

  return (
    <Box bg={"darkBlue.500"}>
      <Helmet>
        <title>View Notes</title>
        <meta name="viewNotes" content="View Notes" />
      </Helmet>
      <Container maxW={"80%"}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 30 }}
          variant="ghost"
          color="white"
          outline="none"
        />

        <Text color={"white"} mt={4} mb={2}>Topic: {noteTopic}</Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading fontSize="2xl" fontWeight={750} mb={2} style={{ color: "white" }}>
            {noteTitle}
          </Heading>
          <Text
            color="white"
            fontSize="sm"
            cursor="pointer"
            onClick={userId === ownerId ? deleteSavedCard : saveCardsSet}
          >
            {userId === ownerId ? "Delete this saved note" : "Save this set"}
          </Text>
        </Flex>

        {cards[currentCardIndex]?.type === "mcq" ? (
          <MCQ
            question={
              (cards[currentCardIndex] as MultipleChoiceQuestion)?.question
            }
            options={
              (cards[currentCardIndex] as MultipleChoiceQuestion)?.options
            }
            multiple_answers={
              (cards[currentCardIndex] as MultipleChoiceQuestion)
                ?.multiple_answers
            }
          />
        ) : (
          <Flashcard
            question={(cards[currentCardIndex] as FlashcardType)?.question}
            answer={(cards[currentCardIndex] as FlashcardType)?.answer}
          />
        )}

        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <IconButton
            aria-label="Previous card"
            icon={<ChevronLeftIcon />}
            onClick={() => setCurrentCardIndex(currentCardIndex - 1)}
            isDisabled={currentCardIndex === 0}
            color="white"
            outline="none"
            variant="ghost"
          />
          <Text color="white" mx={4}>
            {currentCardIndex + 1} out of {totalCards}
          </Text>
          <IconButton
            aria-label="Next card"
            icon={<ChevronRightIcon />}
            onClick={() => setCurrentCardIndex(currentCardIndex + 1)}
            isDisabled={currentCardIndex === totalCards - 1}
            ml={2}
            color="white"
            outline="none"
            variant="ghost"
          />
        </Box>

        <Heading fontSize="2xl" fontWeight={750} color="white" mt={4}>
          {fileName}
        </Heading>

        <iframe src={blobUrl} width="100%" height="900px"></iframe>
      </Container>
    </Box>
  );
}

export default ViewNotes;
