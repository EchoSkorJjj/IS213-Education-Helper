import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Select,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";

import {
  FlashcardType,
  FlashcardTypeWrapper,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionOption,
  MultipleChoiceQuestionTypeWrapper,
} from "~shared/types/data";
import { isFlashcardType } from "~shared/util";

import { getTemporaryContents } from "~features/api";
import { useAuth } from "~features/auth";

import PreFlashcard from "./components/PreFlashcard";
import PreMCQ from "./components/PreMCQ";

const GeneratedContent: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { noteId } = useParams<{ noteId: string }>();
  const { authorization } = useAuth();

  const [GPTContent, setFlashcards] = useState<FlashcardType[]>([]);
  const [MCQs, setMCQs] = useState<MultipleChoiceQuestion[]>([]); // Initialize state for MCQs
  const [title, setTitle] = useState<string>("Type your title here"); // State for the editable title
  const [selectedTopic, setSelectedTopic] =
    useState<string>("science-technology"); // State for the selected topic
  const type = "flashcard"; // State whether Flashcards or MCQ

  useEffect(() => {
    handleGetTemporaryContents(noteId, authorization);
  }, []);

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
      if (isFlashcardType(contents[0])) {
        const flashcards: FlashcardType[] = [];
        contents.forEach((content) => {
          flashcards.push((content as FlashcardTypeWrapper).flashcard);
        });

        setFlashcards(flashcards);
      } else {
        const multipleChoiceQuestions: MultipleChoiceQuestion[] = [];
        contents.forEach((content) => {
          multipleChoiceQuestions.push(
            (content as MultipleChoiceQuestionTypeWrapper).mcq,
          );
        });
        setMCQs(multipleChoiceQuestions);
      }
    }
  };

  const handleTitleChange = (event: any) => {
    setTitle(event.target.innerText);
  };

  const handleTopicChange = (event: any) => {
    setSelectedTopic(event.target.value);
  };

  const removeFlashcardById = (id: string) => {
    const updatedFlashcards = GPTContent.filter(
      (flashcard) => flashcard.id !== id,
    );
    setFlashcards(updatedFlashcards);
  };

  const removeMCQById = (id: string) => {
    const updatedMCQs = MCQs.filter((mcq) => mcq.id !== id);
    setMCQs(updatedMCQs);
  };

  const updateFlashcard = (
    id: string,
    updatedContent: { question: string; answer: string },
  ) => {
    const updatedFlashcards = GPTContent.map((flashcard) => {
      if (flashcard.id === id) {
        return { ...flashcard, ...updatedContent };
      }
      return flashcard;
    });
    setFlashcards(updatedFlashcards);
  };

  const updateMCQ = (
    id: string,
    updatedMCQ: { question: string; options: MultipleChoiceQuestionOption[] },
  ) => {
    const updatedMCQs = MCQs.map((mcq) => {
      if (mcq.id === id) {
        return { ...mcq, ...updatedMCQ };
      }
      return mcq;
    });
    setMCQs(updatedMCQs);
  };

  const handleAddCard = () => {
    let newId;
    if (type === "flashcard") {
      // Calculate new ID based on the highest ID in GPTContent
      newId =
        Math.max(0, ...GPTContent.map((item) => parseInt(item.id, 10))) + 1;
      const newFlashcard: FlashcardType = {
        id: newId.toString(),
        note_id: noteId as string,
        question: "",
        answer: "",
      };
      setFlashcards([...GPTContent, newFlashcard]);
    } else if (type === "mcq") {
      // Calculate new ID based on the highest ID in MCQs
      newId = Math.max(0, ...MCQs.map((mcq) => parseInt(mcq.id, 10))) + 1;
      const newMCQ: MultipleChoiceQuestion = {
        id: newId.toString(),
        note_id: noteId as string,
        question: "",
        options: [
          { option: "", is_correct: false },
          { option: "", is_correct: false },
          { option: "", is_correct: false },
          { option: "", is_correct: false },
        ],
        multiple_answers: false,
      };
      setMCQs([...MCQs, newMCQ]);
    }
  };

  const handleSubmit = () => {
    console.log("Submission Details:");
    console.log(`Title: ${title}`); // Log the title
    console.log(`Selected Topic: ${selectedTopic}`); // Log the selected topic

    if (type === "flashcard") {
      console.log("Final Flashcards:");
      GPTContent.forEach((flashcard) => {
        console.log(
          `Question: ${flashcard.question}, Answer: ${flashcard.answer}`,
        );
      });
    } else if (type === "mcq") {
      console.log("Final MCQs:");
      MCQs.forEach((mcq) => {
        console.log(`Question: ${mcq.question}`);
        mcq.options.forEach((option, index) => {
          console.log(
            `Option ${index + 1}: ${option.option} - Correct: ${option.is_correct ? "Yes" : "No"}`,
          );
        });
      });
    }
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
                value={selectedTopic}
                onChange={handleTopicChange}
                placeholder="Select option"
              >
                <option value="science-technology">
                  Science and Technology
                </option>
                <option value="history-culture">History and Culture</option>
                <option value="business-economics">
                  Business and Economics
                </option>
                <option value="literature-arts">Literature and Arts</option>
                <option value="health-medicine">Health and Medicine</option>
                <option value="education-learning">
                  Education and Learning
                </option>
                <option value="law-politics">Law and Politics</option>
                <option value="environment-geography">
                  Environment and Geography
                </option>
                <option value="psychology-sociology">
                  Psychology and Sociology
                </option>
                <option value="philosophy-ethics">Philosophy and Ethics</option>
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
                <Text fontSize="xs">week5.pdf</Text>
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
        {/* Show Flashcard or MCQ depending on type */}
        {type === "flashcard"
          ? GPTContent.map((data) => (
              <PreFlashcard
                key={data.id}
                GPTContent={data}
                onDelete={() => removeFlashcardById(data.id)}
                onUpdate={updateFlashcard}
              />
            ))
          : MCQs.map((mcq) => (
              <PreMCQ
                key={mcq.id}
                id={mcq.id}
                question={mcq.question}
                options={mcq.options}
                onDelete={removeMCQById}
                onUpdate={updateMCQ}
              />
            ))}

        <Button
          m={10}
          bg="blue"
          color="white"
          width="100%"
          size="lg"
          onClick={handleAddCard}
        >
          + Add Card
        </Button>
      </Container>

      <Container maxW="6xl" mb={10}>
        <Flex justifyContent="flex-end">
          <Button bg="blue" color="white" onClick={handleSubmit}>
            Submit
          </Button>{" "}
        </Flex>
      </Container>
    </Box>
  );
};

export default GeneratedContent;
