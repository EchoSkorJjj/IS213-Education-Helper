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

import { getContent } from "~api";

const ViewNotes = () => {
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

  /*
   * const saveCardsSet = async () => {
   *   add in logic to save Cards to userSavedCards
   * }
   */

  const extractFileData = (fileContent: string) => {
    const byteCharacters = atob(fileContent);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };
  
  const setNoteData = (data: any) => {
    const {
      associated_contents: content,
      note: {
        file_content: fileContent,
        user_id: ownerId,
        title: noteTitle,
        topic: noteTopic,
        file_name: fileName,
      },
    } = data;
  
    setContent(content);
    setOwnerId(ownerId);
    setNoteTitle(noteTitle);
    setNoteTopic(noteTopic);
    setFileName(fileName);
  
    const blob = extractFileData(fileContent);
    const blobUrl = URL.createObjectURL(blob);
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

  useEffect(() => {
    handleGetContent();
  }, [noteId]);

  const cards = content
    ? [
        ...content.flashcards.map((flashcard: FlashcardType) => ({
          ...flashcard,
          type: "flashcard",
        })),
        ...content.mcqs.map((mcq: MultipleChoiceQuestion) => ({
          ...mcq,
          type: "mcq",
        })),
      ]
    : [];

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

        <Text mt={4}>{noteTopic}</Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading fontSize="2xl" fontWeight={750} style={{ color: "white" }}>
            {noteTitle}
          </Heading>
          <Text
            color="white"
            fontSize="sm"
            cursor={userId !== ownerId ? "pointer" : "default"}
            // onClick={userId !== ownerId ? saveCardsSet : undefined}
          >
            {userId === ownerId ? "Already saved" : "Save this set"}
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
};

export default ViewNotes;
