import { LockIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { Attachment } from "@opengovsg/design-system-react";

interface NotesUploadProps {
  selectedFile: File | undefined;
  userIsPaid: boolean | undefined;
  generateType: string;
  setGenerateType: (value: string) => void;
  handleGenerate: () => void;
  handleChange: (file: File) => void;
  handleGenerationChange: () => void;
  handleDelete: () => void;
}

const NotesUpload = ({
  selectedFile,
  userIsPaid,
  handleChange,
  generateType,
  handleGenerationChange,
  handleGenerate,
  setGenerateType,
  handleDelete,
}: NotesUploadProps) => {
  const DropZoneAccept = [".pdf"];
  const maxSize = 5 * 1024 * 1024; // 16MB in bytes
  const toast = useToast();

  const handleError = (error: string) => {
    toast({
      title: "Error uploading file",
      description: error,
      status: "error",
      position: "top",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFileValidation = (file: File) => {
    console.log("Validating file:", file.name);

    return null;
  };

  const handleAttachmentChange = (fileOrFiles?: File | File[]) => {
    // If it's an array, handle the first file or all files based on your requirement
    if (Array.isArray(fileOrFiles)) {
      // Example: handling only the first file from the array
      const file = fileOrFiles[0];
      if (file) {
        handleChange(file);
      }
    } else if (fileOrFiles) {
      // It's a single File object
      handleChange(fileOrFiles);
    } else {
      // No file is provided, handle accordingly
      handleDelete();
    }
    
  };

  // const onDelete = () => {
  //   handleDelete(); // Call the provided handleDelete method to remove the selected file
  // };

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
        <Box width="100%" height="300px" border="none">
          <Attachment
            maxSize={maxSize}
            imagePreview="large"
            accept={DropZoneAccept}
            showFileSize={true}
            value={selectedFile}
            name="file-upload"
            onChange={handleAttachmentChange}
            onError={handleError}
            onFileValidation={handleFileValidation}
            required

          />
        </Box>
        <Box width="100%" textAlign="center">
          <Text
            color="black"
            fontWeight="bold"
            fontSize={{ base: "xl", md: "3xl" }}
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
            px={{ base: "4", md: "5em" }}
            py={{ base: "6", md: "2em" }}
            justifyContent="center"
            alignContent="center"
            color={generateFlashcard ? "white" : "midBlue.500"}
            textAlign="start"
            onClick={() => setGenerateType("flashcard")}
          >
            <Text fontSize={{ base: "lg", md: "lg", lg: "lg" }} mb={8}>
              Generate
              <br />
              <Text
                as="span"
                fontWeight="bold"
                fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
              >
                Flashcard
              </Text>
            </Text>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              mt={{ base: "2", md: "0" }}
              mb={20}
            >
              Flashcards are a great study tool if you need to memorize
              definitions, facts, or short pieces of information for a test
            </Text>
          </Box>
          <Box
            as="button"
            bg={generateFlashcard ? "" : "midBlue.500"}
            width={{ base: "100%", md: "50%" }}
            px={{ base: "4", md: "5em" }}
            py={{ base: "6", md: "1.5em" }}
            justifyContent="center"
            alignContent="center"
            color={generateFlashcard ? "midBlue.500" : "white"}
            textAlign="start"
            onClick={() => handleGenerationChange()}
          >
            <Text fontSize={{ base: "lg", md: "lg", lg: "lg" }} mb={8}>
              Generate
              <br />
              <Text
                as="span"
                fontWeight="bold"
                fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
              >
                MCQs
              </Text>
            </Text>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              mt={{ base: "2", md: "0" }}
              mb={20}
            >
              MCQs (multiple choice questions) will be generated to test your
              understanding
            </Text>
            <HStack mt={{ base: "4", md: "5" }}>
              {!userIsPaid && (
                <>
                  <LockIcon />
                  <Text color={generateFlashcard ? "midBlue.400" : "white"}>
                    This is a paid feature. Unlock it with Pro!
                  </Text>
                </>
              )}
            </HStack>
          </Box>
        </Stack>
        <Flex
          width="100%"
          alignItems="center"
          justifyContent="center"
          mt={{ base: "6", md: "3em" }}
        >
          <Button
            bg="midBlue.500"
            size="lg"
            width={{ base: "80%", md: "15%" }}
            mb={{ base: "6", md: "3em" }}
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
