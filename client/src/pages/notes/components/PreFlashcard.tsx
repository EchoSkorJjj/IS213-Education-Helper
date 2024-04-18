import React, { useState } from 'react';
import { Box, Button, Flex, Spacer, useToast } from '@chakra-ui/react';

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
    updatedContent: { question: string; answer: string }
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
        title: 'Error',
        description: 'Question and answer cannot be empty or just spaces.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (editQuestion.trim().split(/\s+/).length > 300) {
      toast({
        title: 'Error',
        description: 'Question cannot exceed 300 words.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (editAnswer.trim().split(/\s+/).length > 600) {
      toast({
        title: 'Error',
        description: 'Answer cannot exceed 600 words.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onUpdate?.(GPTContent.id, { question: editQuestion.trim(), answer: editAnswer.trim() });
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
    <Box width="100%">
      <Box>
        <Box py={4}>
          <Flex>
            <Box p={4}>Flashcard {GPTContent.id}</Box>
            <Spacer />
            <Button
              colorScheme="gray"
              variant={pressState ? "solid" : "ghost"}
              onClick={handleOnClick}
              mr={5}
            >
              {pressState ? "Confirm your changes" : "Edit this flashcard"}
            </Button>
            <Button
              colorScheme="red"
              variant="ghost"
              onClick={() => onDelete(GPTContent.id)}
            >
              Delete this flashcard
            </Button>
          </Flex>
        </Box>

        <Box bg="midBlue.500" width="100%" p={20} color="white" rounded="lg">
          <Box
            p={4}
            rounded="lg"
            border="1px"
            borderColor="gray.200"
            contentEditable={pressState}
            suppressContentEditableWarning
            onBlur={(event: any) =>
              handleContentEdit(event.target.innerText, "question")
            }
            style={{ pointerEvents: pressState ? "auto" : "none" }}
          >
            {editQuestion}
          </Box>
          <Box height="4"></Box>
          <Box
            p={4}
            rounded="lg"
            border="1px"
            borderColor="gray.200"
            contentEditable={pressState}
            suppressContentEditableWarning
            onBlur={(event: any) =>
              handleContentEdit(event.target.innerText, "answer")
            }
            style={{ pointerEvents: pressState ? "auto" : "none" }}
          >
            {editAnswer}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PreFlashcard;
