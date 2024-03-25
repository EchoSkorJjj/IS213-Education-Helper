import { useState } from "react";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";

interface MCQProps {
  question: string;
  options: string[];
  answer: string;
}

const MCQ = ({ question, options, answer }: MCQProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const getOptionBgColor = (option: string) => {
    if (selectedOption === null) {
      return "transparent";
    } else if (selectedOption === answer && option === answer) {
      return "green.500";
    } else if (selectedOption !== answer && option === selectedOption) {
      return "red.500";
    } else {
      return "transparent";
    }
  };

  const getOptionTextColor = (option: string) => {
    if (selectedOption === option && selectedOption !== answer) {
      return "white";
    } else {
      return "white";
    }
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
          <Text>{question}</Text>
          <Flex mt={4} flexDirection="column" alignItems="center">
            {options.map((option, index) => (
              <Box
                key={index}
                p={2}
                borderWidth={1}
                borderRadius="md"
                bg={getOptionBgColor(option)}
                color={getOptionTextColor(option)}
                mb={2}
                cursor="pointer"
                onClick={() => handleOptionClick(option)}
              >
                <Text>{option}</Text>
              </Box>
            ))}
          </Flex>
        </Flex>
        <Spacer />
      </Flex>
    </Box>
  );
};

export default MCQ;
