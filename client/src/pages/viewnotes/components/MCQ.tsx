import { useState } from "react";
// import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  // Icon,
  // Link,
  // Modal,
  // ModalBody,
  // ModalCloseButton,
  // ModalContent,
  // ModalFooter,
  // ModalHeader,
  // ModalOverlay,
  Stack,
  Text,
  // useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CheckIcon } from '@chakra-ui/icons';

import { MultipleChoiceQuestionOption } from "~shared/types/data";

interface MCQProps {
  question: string;
  options: MultipleChoiceQuestionOption[];
  multiple_answers: boolean;
}

export default function MCQ({ question, options, multiple_answers }: MCQProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const toast = useToast();

  const checkAnswer = () => {
    const correctOptions = options.filter(option => option.is_correct).map(option => option.option);
    const isCorrect = multiple_answers ?
      selectedOptions.sort().join(',') === correctOptions.sort().join(',') :
      selectedOptions[0] === correctOptions[0];

    if (isCorrect) {
      toast({
        title: "Correct answer!",
        description: "You answered correctly!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Incorrect answer!",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setSelectedOptions([]); // Reset selections after showing the toast
  };

  const toggleOption = (option: string) => {
    if (multiple_answers) {
      setSelectedOptions(prev => prev.includes(option) ?
        prev.filter(prevOption => prevOption !== option) :
        [...prev, option]);
    } else {
      setSelectedOptions([option]);
    }
  };
  const optionPrefixes = ['A', 'B', 'C', 'D','E','F','G']; // Add more prefixes if you have more than four options

  return (
    <Box
      bg="white"
      p={{ base: 4, sm: 6 }} // Responsive padding
      rounded="lg"
      shadow="xl"
      border="1px"
      borderColor="gray.200"
      width="full"
      mx="auto" // Center the box
    >
      <Text
        fontSize={{ base: "lg", sm: "xl" }} // Responsive font size
        fontWeight="bold"
        color="blue.800"
        mb={4}
      >
        {question}
      </Text>
      <Text fontSize="md" color="gray.500" mb={4}>
        {multiple_answers ? "Select all that apply:" : "Select one:"}
      </Text>
      <Stack spacing={3}>
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => toggleOption(option.option)}
            variant="outline"
            colorScheme="blue"
            bg={selectedOptions.includes(option.option) ? "blue.500" : "transparent"}
            color={selectedOptions.includes(option.option) ? "white" : "blue.800"}
            justifyContent="flex-start" // Align text to the left
            textAlign="left" // Align button text to the left
            paddingLeft={4} // Give some padding to the left
            height="100%" 
            _hover={{
              bg: selectedOptions.includes(option.option) ? "blue.600" : "blue.50",
            }}
            _focus={{
              boxShadow: "outline",
            }}
            w={{ base: "full", sm: "auto" }} // Full width on base, auto on sm and up
          >
            {`${optionPrefixes[index]}. ${option.option}`} 
          </Button>
        ))}
      </Stack>
      <Flex justifyContent="flex-end" mt={6}>
        <Button
          colorScheme="green"
          onClick={checkAnswer}
          rightIcon={<CheckIcon />}
          width={{ base: "full", sm: "auto" }} // Full width on base, auto on sm and up
          mt={{ base: 4, sm: 0 }} // Margin top on base, none on sm and up
        >
          Submit Answer
        </Button>
      </Flex>
    </Box>
  );
}
