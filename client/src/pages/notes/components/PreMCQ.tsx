import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Flex, Spacer } from "@chakra-ui/react";
import { MultipleChoiceQuestionOption } from "~shared/types/data";

interface PreMCQProps {
  id: string;
  question: string;
  options: MultipleChoiceQuestionOption[];
  onDelete: (id: string) => void;
  onUpdate: (
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
  // Define the localOptions state here
  const [localOptions, setLocalOptions] = useState<MultipleChoiceQuestionOption[]>(options);

  useEffect(() => {
    // This ensures localOptions is updated whenever the options prop changes
    setLocalOptions(options);
  }, [options]);

  const handleQuestionUpdate = (newText: string) => {
    // When the question is updated, call onUpdate with the new question text and current localOptions
    onUpdate(id, { question: newText, options: localOptions });
  };

  const handleOptionTextChange = (optionIndex: number, newText: string) => {
    const updatedOptions = localOptions.map((option, index) =>
      index === optionIndex ? { ...option, text: newText } : option,
    );

    // Update the local state and then propagate changes up to the parent component
    setLocalOptions(updatedOptions);
    onUpdate(id, { question, options: updatedOptions });
  };

  const handleCorrectnessToggle = (optionIndex: number, isCorrect: boolean) => {
    const updatedOptions = localOptions.map((option, index) =>
      index === optionIndex ? { ...option, isCorrect } : option,
    );

    setLocalOptions(updatedOptions); // Update the local state.
    onUpdate(id, { question, options: updatedOptions }); // Pass the updated state, including all options.
  };

  return (
    <Box width="100%">
      {/* Component structure */}
      <Flex py={4}>
        <Box p={4}>MCQ {id}</Box>
        <Spacer />
        <Button colorScheme="gray" variant="ghost" onClick={() => onDelete(id)}>
          Delete this MCQ
        </Button>
      </Flex>

      <Box bg="blue" w="100%" p={20} color="white" rounded="lg">
        <Box
          p={4}
          mb={4}
          contentEditable
          suppressContentEditableWarning
          rounded="lg"
          border="1px"
          borderColor="gray.200"
          onBlur={(event: any) =>
            handleQuestionUpdate(event.currentTarget.textContent || "")
          }
        >
          {question}
        </Box>

        {localOptions.map((opt, index) => (
          <Flex key={index} align="center" mb={4}>
            <Checkbox
              isChecked={opt.is_correct}
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
              contentEditable
              suppressContentEditableWarning
              onBlur={(event: any) =>
                handleOptionTextChange(
                  index,
                  event.currentTarget.textContent || "",
                )
              }
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
