import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { HamburgerIcon } from "@chakra-ui/icons";

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
    updatedMCQ: { question: string; options: MultipleChoiceQuestionOption[] }
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
  const toast = useToast();
  const bg = useColorModeValue("gray.50", "gray.700");

  const onDragEnd = (result: any) => {
    if (!pressState) return; // Only allow drag and drop in edit mode

    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return; // dropped outside the list or in the same position
    }

    const items = Array.from(editOptions);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setEditOptions(items);
  };

  const handleOptionTextChange = (optionIndex: number, newText: string) => {
    const updatedOptions = editOptions.map((option, index) =>
      index === optionIndex ? { ...option, option: newText } : option
    );
    setEditOptions(updatedOptions);
  };

  const handleCorrectnessToggle = (optionIndex: number, isCorrect: boolean) => {
    const updatedOptions = editOptions.map((option, index) =>
      index === optionIndex ? { ...option, is_correct: isCorrect } : option
    );
    setEditOptions(updatedOptions);
  };

  const addOption = () => {
    setEditOptions([...editOptions, { option: "", is_correct: false }]);
  };

  const deleteOption = (optionIndex: number) => {
    const updatedOptions = editOptions.filter(
      (_, index) => index !== optionIndex
    );
    setEditOptions(updatedOptions);
  };

  const validateMCQ = () => {
    if (!editQuestion.trim()) {
      toast({
        title: "Error",
        description: "The question cannot be empty or just spaces.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    const hasValidOptions = editOptions.every((opt) => opt.option.trim());
    if (!hasValidOptions) {
      toast({
        title: "Error",
        description: "All options must contain text.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    const hasCorrectAnswer = editOptions.some((opt) => opt.is_correct);
    if (!hasCorrectAnswer) {
      toast({
        title: "Error",
        description: "There must be at least one correct answer.",
        status: "error",
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
    <DragDropContext onDragEnd={pressState ? onDragEnd : () => {}}>
      <Box width="60vw" p={4} bg={bg} mb={4} boxShadow="md" rounded="lg">
        <Flex align="center">
          <Text fontSize="lg" fontWeight="bold" flex="1">
            MCQ {id}
          </Text>
          <Spacer />
          <Tooltip label={pressState ? "Confirm Changes" : "Edit MCQ"}>
            <IconButton
              aria-label="Edit MCQ"
              icon={pressState ? <CheckIcon /> : <EditIcon />}
              onClick={handleOnClick}
              colorScheme={pressState ? "green" : "blue"}
              mr={2}
            />
          </Tooltip>
          <Tooltip label="Delete MCQ">
            <IconButton
              aria-label="Delete MCQ"
              icon={<DeleteIcon />}
              onClick={() => onDelete(id)}
              colorScheme="red"
            />
          </Tooltip>
        </Flex>
        <Box mt={4}>
          <Text mb={2} fontSize="md" fontWeight="semibold" color="blue.600">
            Question:
          </Text>
          <Box
            p={3}
            bg="white"
            rounded="md"
            border="1px"
            borderColor="gray.200"
            contentEditable={pressState}
            suppressContentEditableWarning
            onBlur={(event: React.FocusEvent<HTMLDivElement>) =>
              setEditQuestion(event.target.innerText)
            }
            style={{
              minHeight: "60px",
              cursor: pressState ? "text" : "default",
            }}
          >
            {editQuestion}
          </Box>
          <Droppable droppableId="options" isDropDisabled={!pressState}>
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {editOptions.map((opt, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                    isDragDisabled={!pressState}
                  >
                    {(provided) => (
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        align="center"
                        mt={4}
                      >
                        {pressState && (
                          <Box {...provided.dragHandleProps} mr={2}>
                            <HamburgerIcon cursor="grab" />
                          </Box>
                        )}
                        <Checkbox
                          isChecked={opt.is_correct}
                          onChange={(e) =>
                            handleCorrectnessToggle(index, e.target.checked)
                          }
                          isDisabled={!pressState}
                          size="lg"
                          colorScheme="green"
                          pr={5}
                          w="0%"
                        />
                        <Box
                          p={3}
                          ml={3}
                          bg="white"
                          flex="1"
                          rounded="md"
                          border="1px"
                          borderColor="gray.300"
                          contentEditable={pressState}
                          suppressContentEditableWarning
                          onBlur={(event: any) =>
                            handleOptionTextChange(index, event.target.innerText)
                          }
                          style={{ minHeight: "40px", cursor: pressState ? "text" : "default" }}
                        >
                          {opt.option}
                        </Box>
                        {pressState && (
                          <IconButton
                            aria-label="Delete Option"
                            icon={<DeleteIcon />}
                            onClick={() => deleteOption(index)}
                            colorScheme="red"
                            size="sm"
                            ml={2}
                          />
                        )}
                      </Flex>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
          {pressState && (
            <Flex justifyContent="flex-end" mt={2}>
              <Button
                rightIcon={<AddIcon />}
                colorScheme="teal"
                variant="solid"
                onClick={addOption}
              >
                Add Option
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
    </DragDropContext>
  );
  
};

export default PreMCQ;
