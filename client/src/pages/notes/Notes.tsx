import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "~features/auth";

import NotesGenerator from "./components/NotesGenerator";
import NotesHeader from "./components/NotesHeader";

import { generateNotes } from "~api";

const NotesGeneratorPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [generateFlashcard, setGenerateFlashcard] = useState<boolean>(true);

  const handleChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleGenerationChange = () => {
    if (!user?.is_paid) {
      openModal();
      return;
    }
    setGenerateFlashcard(false);
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate Notes or MCQs",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: `Generating ${generateFlashcard ? "Flashcards" : "MCQs"}`,
      status: "info",
      position: "top",
      duration: 6000,
      isClosable: true,
    });

    const data = await generateNotes(selectedFile, generateFlashcard);

    console.log(data);
  };
  return (
    <Box bgGradient="linear(to-t, white 10%, darkBlue.500 90%)">
      <NotesHeader />
      <NotesGenerator
        selectedFile={selectedFile}
        handleChange={handleChange}
        generateFlashcard={generateFlashcard}
        handleGenerationChange={handleGenerationChange}
        handleGenerate={handleGenerate}
        setGenerateFlashcard={setGenerateFlashcard}
      />
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
    </Box>
  );
};

export default NotesGeneratorPage;
