/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
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
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";

import {
  ContentType,
  FlashcardType,
  MultipleChoiceQuestion,
} from "~shared/types/data";

import { useAuth } from "~features/auth";

import Flashcard from "./components/Flashcard";
import MCQ from "./components/MCQ";

import { deleteSavedNote, getContent, getSavedNotes, saveNotes } from "~api";

function ViewNotes() {
  const navigate = useNavigate();
  const toast = useToast();
  const { noteId } = useParams<{ noteId: string }>();
  const [content, setContent] = useState<ContentType>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string>();
  const { user } = useAuth();
  const userId = user?.user_id;
  const { authorization } = useAuth();
  const [noteTitle, setNoteTitle] = useState<string>();
  const [noteTopic, setNoteTopic] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkIfUserSaved = async () => {
    if (!authorization || !userId || !noteId) {
      return;
    }
    const response = await getSavedNotes(authorization, userId);
    if (!response || response.length === 0) {
      return false;
    }

    const savedNotesList = response.map((note) => note.fileId);
    return savedNotesList.includes(noteId);
  };

  const deleteSavedCard = async () => {
    if (!noteId || !authorization || !userId) {
      return;
    }
    deleteSavedNote(userId, noteId, authorization);

    toast({
      title: "Note unsaved",
      status: "success",
      position: "top",
      duration: 3000,
      isClosable: true,
    });
  };

  const saveCardsSet = async () => {
    if (!noteId || !authorization || !userId) {
      return;
    }
    saveNotes(userId, noteId, authorization);

    toast({
      title: "Note saved",
      status: "success",
      position: "top",
      duration: 3000,
      isClosable: true,
    });
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
    setIsLoading(true); // Start loading

    if (!noteId || !authorization) {
      return;
    }

    const data = await getContent(noteId, authorization);

    if (!data) {
      return;
    }

    setNoteData(data);

    const saved = await checkIfUserSaved();

    setIsSaved(saved || false);
    setIsLoading(false);
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
          mt={10}
        />
        {isLoading ? (
          <Skeleton height="20px" mb={4} />
        ) : (
          <Text color={"white"} mt={4} mb={2}>
            Topic: {noteTopic}
          </Text>
        )}
        <Flex justifyContent="space-between" alignItems="center">
          {isLoading ? (
            <Skeleton height="40px" mb={5} />
          ) : (
            <Heading
              fontSize="2xl"
              fontWeight={750}
              mb={5}
              style={{ color: "white" }}
            >
              {noteTitle}
            </Heading>
          )}
          {isLoading ? (
            <Skeleton height="40px" width="40px" />
          ) : (
            <IconButton
              aria-label="Save note"
              icon={isSaved ? <FaBookmark /> : <FaRegBookmark />}
              color="white"
              variant="outline"
              border={"none"}
              _hover={{ bg: "transparent" }}
              onClick={async () => {
                if (isSaved) {
                  await deleteSavedCard();
                  setIsSaved(false);
                } else {
                  await saveCardsSet();
                  setIsSaved(true);
                }
              }}
            />
          )}
        </Flex>
        {isLoading ? (
          <>
            <Skeleton height="20px" my="4" />
            <Skeleton height="20px" my="4" />
            <Skeleton height="20px" my="4" />
            <Skeleton height="20px" my="4" width="50%" />
          </>
        ) : cards[currentCardIndex]?.type === "mcq" ? (
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
            key={currentCardIndex}
            question={(cards[currentCardIndex] as FlashcardType)?.question}
            answer={(cards[currentCardIndex] as FlashcardType)?.answer}
          />
        )}
        {isLoading ? (
          <Skeleton height="20px" my={5} />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={10}
            mb={50}
          >
            <IconButton
              aria-label="Previous card"
              icon={<ChevronLeftIcon />}
              onClick={() => setCurrentCardIndex(currentCardIndex - 1)}
              isDisabled={currentCardIndex === 0}
              color="white"
              outline="none"
              variant="ghost"
            />
            <Text color="white" mx={10}>
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
        )}
        {isLoading ? (
          <Skeleton height="20px" />
        ) : (
          <Heading fontSize="2xl" fontWeight={750} color="white" mt={4} mb={5}>
            {fileName}
          </Heading>
        )}
        {isLoading ? (
          <Skeleton height="900px" />
        ) : (
          <iframe src={blobUrl} width="100%" height="900px"></iframe>
        )}{" "}
      </Container>
    </Box>
  );
}

export default ViewNotes;
