import { useState } from "react";
import { Helmet } from "react-helmet-async";
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

import NotesHeader from "./components/NotesHeader";
import NotesGenerator from "./components/NotesUpload";

// import { generateNotes } from "~api";

const NotesGeneratorPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const toast = useToast();
  const { user, generateNotes } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [generateType, setGenerateType] = useState<string>("flashcard");

  const handleChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleGenerationChange = () => {
    if (!user?.is_paid) {
      openModal();
      return;
    }
    setGenerateType("mcq");
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
    localStorage.setItem("filename", selectedFile.name);

    toast({
      title: `Generating ${generateType}`,
      status: "info",
      position: "top",
      duration: 6000,
      isClosable: true,
    });

    await generateNotes(selectedFile, generateType);

    // console.log(data);
  };
  return (
    <Box>
      <Helmet>
        <title>Notes</title>
        <meta name="description" content="Notes" />
      </Helmet>
      <NotesHeader />
      <NotesGenerator
        selectedFile={selectedFile}
        userIsPaid={user?.is_paid}
        handleChange={handleChange}
        generateType={generateType}
        handleGenerationChange={handleGenerationChange}
        handleGenerate={handleGenerate}
        setGenerateType={setGenerateType}
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
