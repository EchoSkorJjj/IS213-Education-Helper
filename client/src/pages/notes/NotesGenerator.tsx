import { useState } from "react";
import { LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Attachment } from "@opengovsg/design-system-react";

import NotesPageImage from "~assets/img/notes_page_image.png";

import { useAuth } from "~features/auth";

const NotesGeneratorPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const { user } = useAuth();
  const DropZoneAccept = [".doc", ".docx", ".pdf", ".ppt", ".pptx"];
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [generateFlashcard, setGenerateFlashcard] = useState<boolean>(true);
  const maxSize = 20 * 1024 * 1024; // 20MB in bytes

  const handleChange = (file?: File) => {
    setSelectedFile(file);
  };

  const handleError = (error: string) => {
    console.error("Error uploading file:", error);
  };

  const handleFileValidation = (file: File) => {
    console.log("Validating file:", file.name);

    return null;
  };

  const handleGenerationChange = () => {
    if (!user?.is_paid) {
      // Show modal to upgrade to Pro
      openModal();
      return;
    }
    setGenerateFlashcard(false);
  };

  return (
    <Flex direction="column" h="100vh" mt={{ base: "1em", md: "8em" }}>
      <Flex flex="45%" bg="darkBlue.500" align="center" justify="center">
        <Box position="relative" height="100%" width="100%">
          <Image
            src={NotesPageImage}
            width={{ base: "3xl", md: "6xl" }}
            position="absolute"
            display={{ base: "none", md: "flex" }}
            bottom="0"
            left={{ md: "50%" }}
            transform={{
              base: "translate(0%, 35%)",
              md: "translate(-50%, 10%)",
            }}
            alt="Centered Image"
          />
          <VStack
            w={"full"}
            position="absolute"
            transform={{ md: "translate(-19%, 170%)" }}
            justify={"center"}
            mt={{ base: 6, md: "none" }}
            px={{ base: 4, md: 8 }}
          >
            <Stack maxW={"2xl"} align={"flex-start"}>
              <Text
                color={"white"}
                lineHeight={1.2}
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              >
                <Text as="span" fontWeight="bold">
                  Notes
                </Text>
                <br />
                <Text as="span" fontWeight="bold">
                  Generator
                </Text>
              </Text>
            </Stack>
          </VStack>
        </Box>
      </Flex>
      <Flex flex="55%" bg="white" justify="center">
        <Flex
          maxW={"6xl"}
          mt={{ md: "4em" }}
          width="100%"
          height="90%"
          direction="column"
        >
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
              onClick={() => setGenerateFlashcard(true)}
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
            <Button bg="midBlue.500" size="lg" width="15%" mb="3em">
              Generate
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="midBlue.400">
            This is a paid feature, go pro to unlock it!
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={closeModal}>
              Close
            </Button>
            <Button colorScheme="blue" as="a" href="/subscribe">
              Go Pro!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default NotesGeneratorPage;
