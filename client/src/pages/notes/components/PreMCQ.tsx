import React, { useState } from "react";
import { Box, Button, Checkbox, Flex, Spacer, useToast } from "@chakra-ui/react";

interface MultipleChoiceQuestionOption {
  option: string;
  is_correct: boolean;
}

interface PreMCQProps {
  id: string;
  question: string;
  options: MultipleChoiceQuestionOption[];
  onDelete: (id: string) => void;
  onUpdate?: (
    id: string,
    updatedMCQ: { question: string; options: MultipleChoiceQuestionOption[] },
  ) => void;
}

const PreMCQ: React.FC<PreMCQProps> = ({
  id,
  question,
  options,
  onDelete,
  onUpdate,
}) => {
  const [editQuestion, setEditQuestion] = useState(question);
  const [editOptions, setEditOptions] = useState<MultipleChoiceQuestionOption[]>(options);
  const [pressState, setPressState] = useState(false);
  const toast = useToast();

  const handleOptionTextChange = (optionIndex: number, newText: string) => {
    const updatedOptions = editOptions.map((option, index) =>
      index === optionIndex ? { ...option, option: newText } : option,
    );
    setEditOptions(updatedOptions);
  };

  const handleCorrectnessToggle = (optionIndex: number, isCorrect: boolean) => {
    const updatedOptions = editOptions.map((option, index) =>
      index === optionIndex ? { ...option, is_correct: isCorrect } : option,
    );
    setEditOptions(updatedOptions);
  };

  const validateMCQ = () => {
    if (!editQuestion.trim()) {
      toast({
        title: 'Error',
        description: 'The question cannot be empty or just spaces.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    const hasValidOptions = editOptions.every(opt => opt.option.trim());
    if (!hasValidOptions) {
      toast({
        title: 'Error',
        description: 'All options must contain text.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    const hasCorrectAnswer = editOptions.some(opt => opt.is_correct);
    if (!hasCorrectAnswer) {
      toast({
        title: 'Error',
        description: 'There must be at least one correct answer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleOnClick = () => {
    if (!pressState) {
      setPressState(true);
    } else {
      if (validateMCQ()) {
        onUpdate?.(id, { question: editQuestion, options: editOptions });
        setPressState(false);
      }
    }
  };

  return (
    <Box width="100%">
      <Flex py={4}>
        <Box p={4}>MCQ {id}</Box>
        <Spacer />
        <Button
          colorScheme="gray"
          variant={pressState ? "solid" : "ghost"}
          onClick={handleOnClick}
          mr={5}
        >
          {pressState ? "Confirm your changes" : "Edit this MCQ"}
        </Button>
        <Button colorScheme="red" variant="ghost" onClick={() => onDelete(id)}>
          Delete this MCQ
        </Button>
      </Flex>

      <Box bg="darkBlue.500" w="100%" p={20} color="white" rounded="lg">
        <Box
          p={4}
          mb={4}
          contentEditable={pressState}
          suppressContentEditableWarning
          rounded="lg"
          border="1px"
          borderColor="gray.200"
          onBlur={(event: any) => setEditQuestion(event.target.innerText)}
          style={{ pointerEvents: pressState ? 'auto' : 'none' }}
        >
          {editQuestion}
        </Box>

        {editOptions.map((opt, index) => (
          <Flex key={index} align="center" mb={4}>
            <Checkbox
              isChecked={opt.is_correct}
              isReadOnly={!pressState}
              onChange={(e) => handleCorrectnessToggle(index, e.target.checked)}
              p={4}
              rounded="lg"
              flex="1"
              border="1px"
            />
            <Box
              p={4}
              ml={3}
              flex="100"
              rounded="lg"
              border="1px"
              contentEditable={pressState}
              suppressContentEditableWarning
              onBlur={(event: any) =>
                handleOptionTextChange(index, event.target.innerText)
              }
              style={{ pointerEvents: pressState ? 'auto' : 'none' }}
            >
              {opt.option}
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default PreMCQ;
