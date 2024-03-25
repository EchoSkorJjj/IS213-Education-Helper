import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
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

import { useAuth } from "~features/auth";

import Flashcard from "./components/Flashcard";
import MCQ from "./components/MCQ";

import { getNotes } from "~api";

function ViewNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    /*
     * const fetchNotes = async () => {
     *   try {
     *     const data = await getNotes(id);
     *     setNotes(data);
     *   } catch (error) {
     *     console.error("Error fetching notes:", error);
     *   }
     * };
     */
    // fetchNotes();
  }, [id]);

  /*
   * const { contentType, content, title, fileName } = notes;
   * const totalItems = content.length;
   */

  /*
   * const handlePrevious = () => {
   *   setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalItems - 1 : prevIndex - 1));
   * };
   */

  /*
   * const handleNext = () => {
   *   setCurrentIndex((prevIndex) => (prevIndex === totalItems - 1 ? 0 : prevIndex + 1));
   * };
   */

  const renderContent = () => {
    /*
     * const item = content[currentIndex];
     * if (contentType === "flashcard") {
     *   return <Flashcard question={item.question} answer={item.answer} />;
     * } else if (contentType === "mcq") {
     *   return <MCQ question={item.question} options={item.options} answer={item.answer} />;
     * } else {
     *   return null;
     * }
     */
  };

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
            <BreadcrumbLink href="#">{title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Text fontSize="2xl" fontWeight={750} style={{ color: "white" }} mt={4}>
          {title}
        </Text>

        {/* {renderContent()} */}

        <Flex justifyContent="center" alignItems="center" mt={4}>
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon />}
            /*
             * onClick={handlePrevious}
             * isDisabled={totalItems === 1}
             */
            variant="ghost"
            color="white"
          />
          <Text color="white" mx={4}>
            {/* {currentIndex + 1} / {totalItems} */}
          </Text>
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon />}
            /*
             * onClick={handleNext}
             * isDisabled={totalItems === 1}
             */
            variant="ghost"
            color="white"
          />
        </Flex>

        <Text fontSize="2xl" fontWeight={750} style={{ color: "white" }} mt={4}>
          File
        </Text>
        <Text style={{ color: "white" }}>{fileName}</Text>

        {/* Render PDF or other file */}
      </Container>
    </Box>
  );
}

export default ViewNotes;
