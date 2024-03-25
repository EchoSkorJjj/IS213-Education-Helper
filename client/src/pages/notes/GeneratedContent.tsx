import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";

// import { uploadToMarketplace, uploadToContentDB } from "~api";
import Flashcard from "./components/Flashcard";
import MCQ from "./components/MCQ";

interface GeneratedContentProps {
  generatedContent: any;
  generateType: string;
}

const GeneratedContent = ({
  generatedContent,
  generateType,
}: GeneratedContentProps) => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = generatedContent.length;

  /*
   *   const handleUploadToMarketplace = async () => {
   *     setIsUploading(true);
   *     try {
   *       await uploadToMarketplace(generatedContent);
   *       // Show success message or perform any necessary actions
   *     } catch (error) {
   *       // Handle error
   *     } finally {
   *       setIsUploading(false);
   *     }
   *   };
   */

  /*
   *   const handleUploadToContentDB = async () => {
   *     setIsUploading(true);
   *     try {
   *       await uploadToContentDB(generatedContent);
   *       // Show success message or perform any necessary actions
   *     } catch (error) {
   *       // Handle error
   *     } finally {
   *       setIsUploading(false);
   *     }
   *   };
   */

  const handleContinueGeneration = () => {
    navigate("/NotesGenerator");
  };

  const handleViewNotes = () => {
    navigate("/ViewNotes");
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems - 1 ? 0 : prevIndex + 1,
    );
  };

  const renderContent = () => {
    const item = generatedContent[currentIndex];
    if (generateType === "flashcard") {
      return <Flashcard question={item.question} answer={item.answer} />;
    } else {
      return (
        <MCQ
          question={item.question}
          options={item.options}
          answer={item.answer}
        />
      );
    }
  };

  return (
    <Box bg="darkBlue.500" minHeight="100vh">
      <Helmet>
        <title>Generated Content</title>
        <meta name="description" content="Generated Flashcards/MCQs" />
      </Helmet>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Generated {generateType}
          </Text>
          {renderContent()}
          <Flex justifyContent="center" alignItems="center">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={handlePrevious}
              isDisabled={totalItems === 1}
              variant="ghost"
              color="white"
            />
            <Text color="white" mx={4}>
              {currentIndex + 1} / {totalItems}
            </Text>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={handleNext}
              isDisabled={totalItems === 1}
              variant="ghost"
              color="white"
            />
          </Flex>
          <Button
            colorScheme="blue"
            // onClick={handleUploadToMarketplace}
            isLoading={isUploading}
          >
            Upload to Marketplace
          </Button>
          <Button
            colorScheme="green"
            // onClick={handleUploadToContentDB}
            isLoading={isUploading}
          >
            Upload to Content DB
          </Button>
          <Button colorScheme="orange" onClick={handleContinueGeneration}>
            Continue Generating
          </Button>
          <Button colorScheme="teal" onClick={handleViewNotes}>
            View Notes
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default GeneratedContent;
