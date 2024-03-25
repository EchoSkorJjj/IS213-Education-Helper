import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  ArrowBackIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  IconButton,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";

import test from "../../assets/pdf/test.pdf";

function ViewNotes() {
  const navigate = useNavigate();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const totalFlashcards = 10; // insert logic for flashcard
  const [isFlipped, setIsFlipped] = useState(false);

  /*
   * const saveFlashcard = async () => {
   *   {
   *     try {
   *       const response = await axios.post();
   *   } catch (error){
   */

  /*
   *   };
   * }
   * }
   */

  return (
    <Box bg={"darkBlue.500"}>
      <Helmet>
        <title>View Notes</title>
        <meta name="viewNotes" content="View Notes" />
      </Helmet>
      <Container maxW={"80%"}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 30 }}
        />

        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Docs</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Current Page</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Text fontSize="2xl" fontWeight={750} style={{ color: "white" }} mt={4}>
          Notes Title
        </Text>

        <Box
          borderRadius={10}
          bgColor="#003294"
          w="100%"
          p={4}
          color="white"
          height="50vh"
          position="relative"
        >
          <Text
            position="absolute"
            top={5}
            right={5}
            color="white"
            fontSize="sm"
            cursor="pointer"
            // onClick={saveFlashcard}
          >
            Save this flashcard set
          </Text>
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
              <Text>
                {isFlipped ? "Answer goes here" : "Question goes here"}
              </Text>
            </Flex>
            <Spacer />
            <Flex justifyContent="center">
              <Link
                onClick={() => setIsFlipped(!isFlipped)}
                textDecoration="none"
                color="white"
                mb={4}
              >
                Click to reveal answer
              </Link>
            </Flex>
          </Flex>
        </Box>

        <Box display="flex" justifyContent="center" mt={4}>
          <IconButton
            aria-label="Previous flashcard"
            icon={<ChevronLeftIcon />}
            onClick={() => setCurrentFlashcardIndex(currentFlashcardIndex - 1)}
            isDisabled={currentFlashcardIndex === 0}
            color="white"
            outline="none"
            variant="ghost"
          />
          <Text fontSize="xl" color="white" mx={4}>
            {currentFlashcardIndex + 1} out of {totalFlashcards}
          </Text>
          <IconButton
            aria-label="Next flashcard"
            icon={<ChevronRightIcon />}
            onClick={() => setCurrentFlashcardIndex(currentFlashcardIndex + 1)}
            isDisabled={currentFlashcardIndex === totalFlashcards - 1}
            ml={2}
            color="white"
            outline="none"
            variant="ghost"
          />
        </Box>

        <Text fontSize="2xl" fontWeight={750} style={{ color: "white" }} mt={4}>
          File
        </Text>
        <Text fontSize="l" style={{ color: "white" }}>
          fileName
        </Text>

        <iframe src={test} width="100%" height="900px"></iframe>
      </Container>
    </Box>
  );
}

export default ViewNotes;
