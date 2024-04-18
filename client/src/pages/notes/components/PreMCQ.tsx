import React, { useState } from "react";
import { Box, Button, Checkbox, Flex, Spacer } from "@chakra-ui/react";

import { MultipleChoiceQuestionOption } from "~shared/types/data";

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
  const [editOptions, setEditOptions] =
    useState<MultipleChoiceQuestionOption[]>(options);
  const [pressState, setPressState] = useState(false);

  const handleQuestionEdit = (content: string) => {
    setEditQuestion(content);
  };

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

  const handleOnClick = () => {
    if (!pressState) {
      setPressState(true);
    } else {
      setPressState(false);
      onUpdate?.(id, { question: editQuestion, options: editOptions });
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

      <Box bg="Blue.500" w="100%" p={20} color="white" rounded="lg">
        <Box
          p={4}
          mb={4}
          contentEditable={pressState}
          suppressContentEditableWarning
          rounded="lg"
          border="1px"
          borderColor="gray.200"
          onBlur={(event: any) => handleQuestionEdit(event.target.innerText)}
          style={{ pointerEvents: pressState ? 'auto' : 'none' }}
        >
          {editQuestion}
        </Box>

        {editOptions.map((opt, index) => (
          <Flex key={index} align="center" mb={4}>
            <Checkbox
              isChecked={opt.is_correct}
              isReadOnly={!pressState}
              onChange={(event: any) =>
                handleCorrectnessToggle(index, event.target.checked)
              }
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
