/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-statements */
/* eslint-disable max-params */
/* eslint-disable max-lines */
import { useEffect, useRef, useState } from "react";
import FlipMove from "react-flip-move";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  keyframes,
  Select,
  Skeleton,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";

import {
  FlashcardType,
  FlashcardTypeWrapper,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionTypeWrapper,
} from "~shared/types/data";
import { isFlashcardType } from "~shared/util";

import {
  commitTemporaryContents,
  createTemporaryContent,
  deleteTemporaryContent,
  getTemporaryContents,
  getTopics,
  updateTemporaryContent,
} from "~features/api";
import { useAuth } from "~features/auth";

import PreFlashcard from "./components/PreFlashcard";
import PreMCQ from "./components/PreMCQ";

import { Topic } from "~types/data";

const GeneratedContent: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { noteId } = useParams<{ noteId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const { authorization } = useAuth();

  const [GPTContent, setFlashcards] = useState<FlashcardType[]>([]);
  const [MCQs, setMCQs] = useState<MultipleChoiceQuestion[]>([]); // Initialize state for MCQs
  const [title, setTitle] = useState<string>(""); // State for the editable title
  const [selectedTopic, setSelectedTopic] =
    useState<string>("science-technology"); // State for the selected topic
  const [type, setType] = useState<string>("flashcard");
  const pollCountRef = useRef<number>(0);
  const previousCountRef = useRef<number>(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const filename = localStorage.getItem("filename") || "No file uploaded";
  const [isLoading, setIsLoading] = useState(true);
  const pulseAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

  useEffect(() => {
    // Call once to fetch immediately
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
    handleGetTemporaryContents(noteId, authorization);

    /*
     * ... then set up polling for every 5 seconds in case
     * fetch was called when content was still being fed to
     * the contents service. Stops polling after 5 consecutive
     * polls with no change to number of contents.
     */
    intervalIdRef.current = setInterval(() => {
      handleGetTemporaryContents(noteId, authorization);
    }, 5000);

    return () =>
      clearInterval(intervalIdRef.current as ReturnType<typeof setInterval>); // Clean up on component unmount
  }, [noteId, authorization]);

  const handleGetTemporaryContents = async (
    noteId: string | undefined,
    authorization: string | null,
  ) => {
    if (!noteId || !authorization) {
      return;
    }

    const response = await getTemporaryContents(noteId, authorization);
    if (response) {
      const contents = response.contents;
      if (
        previousCountRef.current > 0 &&
        contents.length === previousCountRef.current
      ) {
        pollCountRef.current++;
        if (pollCountRef.current >= 5) {
          clearInterval(
            intervalIdRef.current as ReturnType<typeof setInterval>,
          );
          return;
        }
      } else {
        pollCountRef.current = 0;
        previousCountRef.current = contents.length;
      }

      if (isFlashcardType(contents[0])) {
        const flashcards: FlashcardType[] = [];
        contents.forEach((content) => {
          flashcards.push((content as FlashcardTypeWrapper).flashcard);
        });

        setType("flashcard");
        setFlashcards(flashcards);
      } else {
        const multipleChoiceQuestions: MultipleChoiceQuestion[] = [];
        contents.forEach((content) => {
          multipleChoiceQuestions.push(
            (content as MultipleChoiceQuestionTypeWrapper).mcq,
          );
        });

        setType("mcq");
        setMCQs(multipleChoiceQuestions);
      }
      setIsLoading(false);
    }
  };

  const handleRemoveTemporaryContent = async (
    noteId: string | undefined,
    contentId: string | undefined,
    type: string,
    authorization: string | null,
  ) => {
    if (!noteId || !authorization || !contentId) {
      return;
    }
    const response = await deleteTemporaryContent(
      noteId,
      contentId,
      type,
      authorization,
    );
    if (!response) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }

    if (type === "flashcard") {
      const updatedFlashcards = GPTContent.filter(
        (flashcard) => flashcard.id !== contentId,
      );
      setFlashcards(updatedFlashcards);
    } else {
      const updatedMCQs = MCQs.filter((mcq) => mcq.id !== contentId);
      setMCQs(updatedMCQs);
    }
  };

  const handleUpdateTemporaryContent = async (
    noteId: string | undefined,
    contentId: string | undefined,
    type: string,
    newContent: any,
    authorization: string | null,
  ) => {
    if (!noteId || !authorization || !contentId) {
      return;
    }

    const newContentObj = {
      id: contentId,
      note_id: noteId,
      ...newContent,
    };

    let wrapper: FlashcardTypeWrapper | MultipleChoiceQuestionTypeWrapper;
    let setter;
    let state;
    if (type === "flashcard") {
      wrapper = { flashcard: newContentObj };
      setter = setFlashcards;
      state = GPTContent;
    } else {
      wrapper = { mcq: newContentObj };
      setter = setMCQs;
      state = MCQs;
    }

    const response = await updateTemporaryContent(
      noteId,
      contentId,
      type == "flashcard" ? 0 : 1,
      wrapper,
      authorization,
    );
    if (!response) {
      toast({
        title: "Error",
        description: "Failed to update content",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }

    const updatedState = state.map((content) => {
      if (content.id === contentId) {
        return newContentObj;
      }
      return content;
    });
    setter(updatedState);
  };

  const handleCreateTemporaryContent = async () => {
    if (!noteId || !authorization) {
      return;
    }

    if (type === "flashcard") {
      const newFlashcard = {
        flashcard: {
          note_id: noteId,
          question: "Write your questions here!",
          answer: "Write your answers here!",
        },
      };

      const response = await createTemporaryContent(
        noteId,
        0,
        newFlashcard,
        authorization,
      );
      if (
        !response ||
        !response.success ||
        !response.created_content.flashcard
      ) {
        toast({
          title: "Error",
          description: "Failed to create content",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFlashcards([...GPTContent, response.created_content.flashcard]);
    } else {
      const newMCQ = {
        mcq: {
          note_id: noteId,
          question: "Write your questions here!",
          options: [
            { option: "Your first option...", is_correct: true },
            { option: "Your second option...", is_correct: false },
            { option: "Your third option...", is_correct: false },
            { option: "Your fourth option...", is_correct: false },
          ],
          multiple_answers: false,
        },
      };

      const response = await createTemporaryContent(
        noteId,
        1,
        newMCQ,
        authorization,
      );
      if (!response || !response.success || !response.created_content.mcq) {
        toast({
          title: "Error",
          description: "Failed to create content",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setMCQs([...MCQs, response.created_content.mcq]);
    }
  };

  const handleCommitTemporaryContents = async () => {
    if (!noteId || !authorization) {
      return;
    }

    const response = await commitTemporaryContents(
      noteId,
      title,
      selectedTopic,
      authorization,
    );
    if (!response || !response.success) {
      toast({
        title: "Error",
        description: "Failed to commit contents",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    localStorage.removeItem("filename"); // Clear the filename

    navigate(`/viewnotes/${noteId}`);
  };

  const handleTitleChange = (event: any) => {
    setTitle(event.target.innerText);
  };

  const handleTopicChange = (event: any) => {
    setSelectedTopic(event.target.value);
  };

  useEffect(() => {
    if (!noteId) {
      navigate("/generator");
      toast({
        title: "Note not found",
        description: "Please select a note to view",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  }, [noteId]);

  return (
    <Box>
      <Helmet>
        <title>Generated Notes</title>
        <meta
          name="description"
          content="This page holds all the generated flashcards or MCQs"
        />
      </Helmet>

      {/* Blue box at the top */}
      <Box bg="darkBlue.500" py={4} px={6} color="white" h="300px">
        {/* Container with Title and Topic */}
        <Container flexDirection="column" maxW={"6xl"}>
          {/* Title */}
          <Box mb="8" pl={3}>
            <Text fontSize="xs" pb={3}>
              Title
            </Text>
            <Box
              p={3}
              as="b"
              fontSize="2xl"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleTitleChange} // Capture the title change on blur
              rounded="lg"
              border="1px"
              borderColor="gray.200"
            >
              {title}
            </Box>
          </Box>

          {/* Topic */}

          <Flex>
            <Box>
              <Text pl={3} pb={2} fontSize="xs">
                Topic
              </Text>

              <Select
                size="lg"
                pl={3}
                width="150%"
                onChange={handleTopicChange}
                placeholder="Select option"
                color={"gray.500"}
              >
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </Select>
            </Box>

            <Spacer />

            <Box>
              <Flex pt={9} justifyContent="flex-end">
                <Text fontSize="xs" color="gray.500">
                  Uploaded Document
                </Text>
              </Flex>

              <Flex justifyContent="flex-end">
                <AttachmentIcon mr="2" />
                <Text fontSize="xs">{filename}</Text>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Cards */}

      <Container
        display="flex"
        flexDirection="column"
        maxW={"6xl"}
        justifyContent="center"
        alignItems="center"
        pt="4"
        pb="4"
      >
        {isLoading ? (
          Array(10)
            .fill(0)
            .map((_, index) => (
              <Box key={index} width="100%" p={4} my={2}>
                {" "}
                {/* Add padding and margin */}
                <Skeleton
                  height="300px"
                  width="100%"
                  startColor="gray.300"
                  endColor="gray.500"
                  animation={`${pulseAnimation} 1.5s ease-in-out infinite`}
                />
              </Box>
            ))
        ) : type === "flashcard" ? (
          <FlipMove>
            {GPTContent.map((data) => (
              <div key={data.id}>
                <PreFlashcard
                  GPTContent={data}
                  onDelete={() => {
                    handleRemoveTemporaryContent(
                      noteId,
                      data.id,
                      "flashcard",
                      authorization,
                    );
                  }}
                  onUpdate={(id, newData) => {
                    handleUpdateTemporaryContent(
                      noteId,
                      id,
                      "flashcard",
                      newData,
                      authorization,
                    );
                  }}
                />
              </div>
            ))}
          </FlipMove>
        ) : (
          <FlipMove>
            {MCQs.map((mcq) => (
              <div key={mcq.id}>
                <PreMCQ
                  id={mcq.id}
                  question={mcq.question}
                  options={mcq.options}
                  onDelete={() => {
                    handleRemoveTemporaryContent(
                      noteId,
                      mcq.id,
                      "mcq",
                      authorization,
                    );
                  }}
                  onUpdate={(id, newData) => {
                    handleUpdateTemporaryContent(
                      noteId,
                      id,
                      "mcq",
                      newData,
                      authorization,
                    );
                  }}
                />
              </div>
            ))}
          </FlipMove>
        )}
        <Button
          m={10}
          bg="blue"
          color="white"
          width="100%"
          size="lg"
          onClick={handleCreateTemporaryContent}
          isDisabled={isLoading}
        >
          + Add Card
        </Button>
      </Container>

      <Container maxW="6xl" mb={10}>
        <Flex justifyContent="flex-end">
          <Button
            bg="blue"
            color="white"
            onClick={handleCommitTemporaryContents}
            isDisabled={isLoading}
          >
            Submit
          </Button>{" "}
        </Flex>
      </Container>
    </Box>
  );
};

export default GeneratedContent;
