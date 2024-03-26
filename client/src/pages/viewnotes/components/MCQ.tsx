import { useState } from "react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { MultipleChoiceQuestionOption } from "~shared/types/data";

interface MCQProps {
  question: string;
  options: MultipleChoiceQuestionOption[];
  multiple_answers: boolean;
}

export default function MCQ({ question, options, multiple_answers }: MCQProps) {
  const [modalMessage, setModalMessage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const checkAnswer = () => {
    const correctOptions = options
      .filter((option) => option.is_correct)
      .map((option) => option.option);
    if (multiple_answers) {
      const isCorrect =
        selectedOptions.every((option) => correctOptions.includes(option)) &&
        correctOptions.every((option) => selectedOptions.includes(option));
      setModalMessage(
        isCorrect
          ? "Congratulations! You answered correctly!"
          : "Wrong, try again",
      );
    } else {
      setModalMessage(
        selectedOptions[0] === correctOptions[0]
          ? "Congratulations! You answered correctly!"
          : "Wrong, try again",
      );
    }
    onOpen();
  };

  const toggleOption = (option: string) => {
    if (multiple_answers) {
      setSelectedOptions((prevOptions) => {
        if (prevOptions.includes(option)) {
          return prevOptions.filter((prevOption) => prevOption !== option);
        } else {
          return [...prevOptions, option];
        }
      });
    } else {
      setSelectedOptions((prevOptions) => {
        if (prevOptions.includes(option)) {
          return [];
        } else {
          return [option];
        }
      });
    }
  };

  return (
    <Box
      borderRadius={10}
      bgColor="#003294"
      w="100%"
      p={4}
      color="white"
      overflow="auto"
      height="50vh"
      position="relative"
    >
      <Stack alignItems="center" m={5}>
        <Text textAlign={"center"} fontWeight="bold">
          {question}
        </Text>
      </Stack>
      <Stack spacing={4}>
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => toggleOption(option.option)}
            variant={
              selectedOptions.includes(option.option) ? "solid" : "outline"
            }
            colorScheme={
              selectedOptions.includes(option.option) ? "blue" : "blue"
            }
            size="sm"
            color="white"
          >
            {option.option}
          </Button>
        ))}
      </Stack>

      <Flex justifyContent="center">
        <Link onClick={checkAnswer} textDecoration="none" color="white" m={4}>
          Click to reveal answer
        </Link>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Answer Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalMessage === "Congratulations! You answered correctly!" ? (
              <Box textAlign="center">
                <Icon
                  as={CheckCircleIcon}
                  color="green.500"
                  boxSize={20}
                  mb={4}
                />
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Congratulations!
                </Text>
                <Text>You answered correctly!</Text>
              </Box>
            ) : (
              <Box textAlign="center">
                <Icon as={CloseIcon} color="red.500" boxSize={20} mb={4} />
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Oops!
                </Text>
                <Text>Your answer is incorrect. Please try again.</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
