import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Searchbar, Tag } from "@opengovsg/design-system-react";

import { Pagination } from "~components/pagination";

import { NotePreview, Topic } from "~types/data";

import { fetchImageURL } from "~util";

interface NotesListProps {
  notes: NotePreview[];
  topics: Topic[];
  setNotesTitle: (notesTitle: string) => void;
  setCurrentPage: (pageNumber: number) => void;
  currentPage: number;
  totalNotesCount: number;
  header: string;
  description: string;
}

const NotesList = ({
  notes,
  topics,
  setNotesTitle,
  setCurrentPage,
  currentPage,
  totalNotesCount,
  header,
  description,
}: NotesListProps) => {
  const pageSize = 4;
  const [imageURLs, setImageURLs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageURLs = async () => {
      const newImageURLs = { ...imageURLs };

      for (const note of notes) {
        if (!newImageURLs[note.fileId]) {
          newImageURLs[note.fileId] = await fetchImageURL(note.topic);
        }
      }

      setImageURLs(newImageURLs);
    };

    fetchImageURLs();
  }, [notes]);

  const handleCardClick = (fileId: string) => () => {
    navigate(`/viewnotes/${fileId}`)
  };

  return (
    <Flex direction="column" height="100%" alignItems={"center"} px="10">
      <Flex maxW={"6xl"} width="100%" direction="column">
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex direction="column">
            <Text
              color="lightBlue.500"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
            >
              {header}
            </Text>
            <Text color="gray.500" fontSize={{ base: "lg", lg: "xl" }}>
              {description}
            </Text>
          </Flex>
          <Box>
            <Searchbar
              placeholder="Search notes"
              style={{
                bg: "black",
              }}
              onChange={(e) => {
                setNotesTitle(e.target.value);
              }}
              isExpanded={true}
            />
          </Box>
        </Flex>
        {notes.length !== 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 3, lg: 4 }}
          spacing={5}
          paddingTop="5"
          paddingBottom="5"
        >
          {notes.map((note) => (
            <Card
              maxW="sm"
              maxH="sm"
              key={note.fileId}
              as="button"
              onClick={handleCardClick(note.fileId)}
              border={0}
              rounded="0"
            >
              <Image
                objectFit="cover"
                src={imageURLs[note.fileId] || 'https://picsum.photos/200/300'}
                alt={note.title}
                borderRadius="lg"
                height="50%"
                width="100%"
                border={0}
                rounded="0"
              />

              <CardBody pl="4" p="0" maxW={"sm"} maxH={"sm"}>
                <Stack
                  pt="1em"
                  pr="3em"
                  spacing="2"
                  direction="column"
                  textAlign="start"
                >
                  <Text>
                    {
                      topics.find(topic => topic.value === note.topic)?.label
                    }
                  </Text>
                  <Text
                    isTruncated
                    fontSize={{ base: "2xl", md: "5xl", lg: "2xl" }}
                    fontWeight="bold"
                  >
                    {note.title}
                  </Text>
                  <Text>
                    {note.fileName.length > 20 ? `${note.fileName.slice(0, 22)} ...` : note.fileName}
                  </Text>
                  <Tag
                    size="md"
                    variant="subtle"
                    colorScheme={note.generateType.toUpperCase() === "MCQ" ? "teal" : "purple"}
                  >
                    {note.generateType.toUpperCase()}
                  </Tag>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        ) : (
          <Text textAlign="center" paddingTop="5">No notes found</Text>
        )}
        <Pagination
          color="black"
          isDisabled={notes.length === 0}
          totalCount={totalNotesCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Flex>
    </Flex>
  );
};

export default NotesList;
