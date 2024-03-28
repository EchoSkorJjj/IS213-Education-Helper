import React, { useState } from "react";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";

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
  // Local state to track edits
  const [editQuestion, setEditQuestion] = useState(GPTContent.question);
  const [editAnswer, setEditAnswer] = useState(GPTContent.answer);
  const [pressState, setPressState] = useState(false);

  // Adjust handleContentEdit to immediately call onUpdate
  const handleContentEdit = (content: string, type: string) => {
    if (type === "question") {
      setEditQuestion(content); // Update local state
    } else if (type === "answer") {
      setEditAnswer(content); // Update local state
    }
  };

  const handleOnClick = () => {
    if (pressState == false) {
      setPressState(true);
    } else {
      setPressState(false);
      onUpdate?.(GPTContent.id, { question: editQuestion, answer: editAnswer });
    }
  }

  return (
    <Box width="100%">
      <Box>
        <Box py={4}>
          <Flex>
            <Box p={4}>Flashcard {GPTContent.id}</Box>
            <Spacer />
            <Button
              colorScheme="gray"
              variant={pressState ? "solid" : "ghost"}
              onClick={handleOnClick} // Removed the arrow function
              mr={5}
            >
              {pressState ? "Confirm your changes" : "Edit this flashcard"}
            </Button>
            <Button
              colorScheme="gray"
              variant="ghost"
              onClick={() => onDelete(GPTContent.id)}
            >
              Delete this flashcard
            </Button>
          </Flex>
        </Box>

        <Box bg="blue" width="100%" p={20} color="white" rounded="lg">
          <Box
            p={4}
            rounded="lg"
            border="1px"
            borderColor="gray.200"
            contentEditable={pressState} // Only allow editing when pressState is true
            suppressContentEditableWarning
            onBlur={(event: any) =>
              handleContentEdit(event.target.innerText, "question")
            }
          >
            {/* Display edited question if available, otherwise display original question */}
            {editQuestion !== undefined ? editQuestion : GPTContent.question}
          </Box>
          <Box height="4"></Box>
          <Box
            p={4}
            rounded="lg"
            border="1px"
            borderColor="gray.200"
            contentEditable={pressState} // Only allow editing when pressState is true
            suppressContentEditableWarning
            onBlur={(event: any) =>
              handleContentEdit(event.target.innerText, "answer")
            }
          >
            {editAnswer}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PreFlashcard;
