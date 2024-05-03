import React, { useState } from "react";
import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

interface GPTContent {
  id: string;
  question: string;
  answer: string;
}

interface PreFlashcardProps {
  GPTContent: GPTContent;
  onDelete: (id: string) => void;
  onUpdate?: (
    id: string,
    updatedContent: { question: string; answer: string },
  ) => void;
}

const PreFlashcard: React.FC<PreFlashcardProps> = ({
  GPTContent,
  onDelete,
  onUpdate,
}) => {
  const [editQuestion, setEditQuestion] = useState(GPTContent.question);
  const [editAnswer, setEditAnswer] = useState(GPTContent.answer);
  const [pressState, setPressState] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue("gray.50", "gray.700");

  const handleContentEdit = (content: string, type: string) => {
    if (type === "question") {
      setEditQuestion(content);
    } else if (type === "answer") {
      setEditAnswer(content);
    }
  };

  const validateAndEditContent = () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      toast({
        title: "Error",
        description: "Question and answer cannot be empty or just spaces.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (editQuestion.trim().split(/\s+/).length > 300) {
      toast({
        title: "Error",
        description: "Question cannot exceed 300 words.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (editAnswer.trim().split(/\s+/).length > 600) {
      toast({
        title: "Error",
        description: "Answer cannot exceed 600 words.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onUpdate?.(GPTContent.id, {
      question: editQuestion.trim(),
      answer: editAnswer.trim(),
    });
    setPressState(false);
  };

  const handleOnClick = () => {
    if (!pressState) {
      setPressState(true);
    } else {
      validateAndEditContent();
    }
  };

  return (
    <Box width="100%" p={4} bg={bg} boxShadow="md" rounded="lg" mb={3}>
      <Flex align="center">
        <Text fontSize="md" fontWeight="bold" flex="1">
          Flashcard {GPTContent.id}
        </Text>
        <Spacer />
        <Tooltip label={pressState ? "Confirm Changes" : "Edit Flashcard"}>
          <IconButton
            aria-label="Edit Flashcard"
            icon={pressState ? <CheckIcon /> : <EditIcon />}
            onClick={handleOnClick}
            colorScheme={pressState ? "green" : "blue"}
            mr={2}
          />
        </Tooltip>
        <Tooltip label="Delete Flashcard">
          <IconButton
            aria-label="Delete Flashcard"
            icon={<DeleteIcon />}
            onClick={() => onDelete(GPTContent.id)}
            colorScheme="red"
          />
        </Tooltip>
      </Flex>
      <Box mt={4} p={4} bg="white" rounded="lg">
        <Text mb={2} fontSize="md" fontWeight="semibold" color="blue.600">
          Question:
        </Text>
        <Box
          p={3}
          bg="gray.100"
          rounded="md"
          border="1px"
          borderColor="gray.200"
          contentEditable={pressState}
          suppressContentEditableWarning
          onBlur={(event: any) =>
            handleContentEdit(event.target.innerText, "question")
          }
          style={{ minHeight: "60px", cursor: pressState ? "text" : "default" }}
        >
          {editQuestion}
        </Box>
      </Box>
      <Box mt={4} p={4} bg="white" rounded="lg">
        <Text mb={2} fontSize="md" fontWeight="semibold" color="green.600">
          Answer:
        </Text>
        <Box
          p={3}
          bg="gray.100"
          rounded="md"
          border="1px"
          borderColor="gray.200"
          contentEditable={pressState}
          suppressContentEditableWarning
          onBlur={(event: any) =>
            handleContentEdit(event.target.innerText, "answer")
          }
          style={{ minHeight: "60px", cursor: pressState ? "text" : "default" }}
        >
          {editAnswer}
        </Box>
      </Box>
    </Box>
  );
};

export default PreFlashcard;
