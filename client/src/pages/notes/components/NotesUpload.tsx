import { LockIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Attachment } from "@opengovsg/design-system-react";

interface NotesUploadProps {
  selectedFile: File | undefined;
  generateType: string;
  setGenerateType: (value: string) => void;
  handleGenerate: () => void;
  handleChange: (file: File) => void;
  handleGenerationChange: () => void;
}

const NotesUpload = ({
  selectedFile,
  handleChange,
  generateType,
  handleGenerationChange,
  handleGenerate,
  setGenerateType,
}: NotesUploadProps) => {
  const DropZoneAccept = [".pdf"];
  const maxSize = 15 * 1024 * 1024; // 16MB in bytes

  const handleError = (error: string) => {
    console.error("Error uploading file:", error);
  };

  const handleFileValidation = (file: File) => {
    console.log("Validating file:", file.name);

    return null;
  };

  const generateFlashcard = generateType === "flashcard";

  return (
    <Flex
      w="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt="5"
      px="10"
    >
      <Flex maxW={"6xl"} width="100%" height="90%" direction="column">
        <Box width="100%">
          <Attachment
            height="210px"
            maxSize={maxSize}
            imagePreview="large"
            accept={DropZoneAccept}
            showFileSize={true}
            value={selectedFile}
            name="file-upload"
            onChange={handleChange}
            onError={handleError}
            onFileValidation={handleFileValidation}
          />
        </Box>
        <Box width="100%" textAlign={"center"}>
          <Text
            color="black"
            fontWeight="bold"
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            Select Notes Type
          </Text>
        </Box>
        <Stack
          direction={{ base: "column", md: "row" }}
          width="100%"
          mt="6"
          borderWidth="1px"
          borderColor="midBlue.500"
          spacing="0"
        >
          <Box
            as="button"
            bg={generateFlashcard ? "midBlue.500" : ""}
            width={{ base: "100%", md: "50%" }}
            pl="5em"
            pr="8em"
            pt="2em"
            pb="2em"
            justifyContent={"center"}
            alignContent="center"
            color={generateFlashcard ? "white" : "midBlue.500"}
            textAlign="start"
            onClick={() => setGenerateType("flashcard")}
          >
            <Text fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              Generate
              <br />
              <Text as="span" fontWeight="bold">
                Flashcard
              </Text>
            </Text>
            <Text fontSize={{ base: "lg" }}>
              Flashcards are a great study tool if you need to memorize
              definitions, facts, or short pieces of information for a test
            </Text>
          </Box>
          <Box
            as="button"
            bg={generateFlashcard ? "" : "midBlue.500"}
            width={{ base: "100%", md: "50%" }}
            pl="5em"
            pr="8em"
            pt="1.5em"
            pb="1.4em"
            justifyContent={"center"}
            alignContent="center"
            color={generateFlashcard ? "midBlue.500" : "white"}
            textAlign="start"
            onClick={() => handleGenerationChange()}
          >
            <Text fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              Generate
              <br />
              <Text as="span" fontWeight="bold">
                MCQs
              </Text>
            </Text>
            <Text fontSize={{ base: "lg" }}>
              MCQs (multiple choice questions) will be generated to test your
              understanding
            </Text>
            <HStack mt="5">
              <LockIcon />
              <Text color={generateFlashcard ? "midBlue.400" : "white"}>
                This is a paid feature. Unlock it with Pro!
              </Text>
            </HStack>
          </Box>
        </Stack>
        <Flex
          width="100%"
          alignItems="center"
          justifyContent={"center"}
          mt="3em"
        >
          <Button
            bg="midBlue.500"
            size="lg"
            width="15%"
            mb="3em"
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NotesUpload;
