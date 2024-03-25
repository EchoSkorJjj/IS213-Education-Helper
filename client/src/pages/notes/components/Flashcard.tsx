import { useState } from "react";
import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";

interface FlashcardProps {
  question: string;
  answer: string;
}

const Flashcard = ({ question, answer }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Box
      borderRadius={10}
      bgColor="#003294"
      w="100%"
      p={4}
      color="white"
      height="50vh"
      position="relative"
    >
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        pt={4}
      >
        <Spacer />
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text>{isFlipped ? answer : question}</Text>
        </Flex>
        <Spacer />
        <Flex justifyContent="center">
          <Link onClick={handleFlip} textDecoration="none" color="white" mb={4}>
            {isFlipped ? "Click to show question" : "Click to reveal answer"}
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Flashcard;
