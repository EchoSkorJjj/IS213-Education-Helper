import { useEffect, useState } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { Searchbar, Tag } from "@opengovsg/design-system-react";

import { Pagination } from "~components/pagination";

import { NotePreview, Topic } from "~types/data";
import { fetchImageURL } from "~util";

interface MarketProps {
  notes: NotePreview[];
  topics: Topic[];
  notesTitle: string;
  setNotesTitle: (notesTitle: string) => void;
  setCurrentMarketPage: (pageNumber: number) => void;
  currentMarketPage: number;
  totalNotesCount: number;
}
// Debounce function
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
const MarketList = ({
  notes,
  topics,
  notesTitle,
  setNotesTitle,
  setCurrentMarketPage,
  currentMarketPage,
  totalNotesCount,
}: MarketProps) => {
  const pageSize = 8;
  const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
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

  const debouncedSearchTerm = useDebounce(notesTitle, 200); // 500 ms delay
  useEffect(() => {
    if (debouncedSearchTerm) {
      setNotesTitle(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, setNotesTitle]);

  const handleCardClick = (fileId: string) => () => {
    navigate(`/viewnotes/${fileId}`);
  };

  return (
    <Flex
      direction="column"
      height="100%"
      alignItems={"center"}
      mb="5em"
      px="10"
    >
      <Flex maxW={"6xl"} mt={{ md: "4em" }} width="100%" direction="column">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }} // Add this line
        >
          <Box>
            <Text
              color="midBlue.500"
              fontSize={{ base: "2xl", md: "5xl", lg: "7xl" }}
              fontWeight="bold"
            >
              Marketplace
            </Text>
          </Box>
          <Box w={{ base: "100%", md: "auto" }}>
            <Searchbar
              placeholder="Search notes"
              style={{ bg: "black" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // Update to search through objects if needed
                setNotesTitle(e.target.value);
              }}
              isExpanded={true}
            />
          </Box>
        </Flex>
        {notes.length !== 0 ? (
          <>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 4 }}
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
                    src={
                      imageURLs[note.fileId] || "https://picsum.photos/200/300"
                    }
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
                      spacing="2"
                      direction="column"
                      textAlign="start"
                    >
                      <Text fontSize={{ base: "sm" }}>
                        {
                          topics.find((topic) => topic.value === note.topic)
                            ?.label
                        }
                      </Text>
                      <Tooltip label={note.title} aria-label="Note title">
                        <Text
                          isTruncated
                          fontSize={{ base: "lg", md: "md" }}
                          fontWeight="bold"
                        >
                          {note.title.length > 19
                            ? `${note.title.slice(0, 19)} ...`
                            : note.title}{" "}
                        </Text>
                      </Tooltip>
                      <Tooltip label={note.fileName} aria-label="File name">
                        <Text>
                          {note.fileName.length > 19
                            ? `${note.fileName.slice(0, 19)} ...`
                            : note.fileName}
                        </Text>
                      </Tooltip>
                      <Tag
                        size="md"
                        variant="subtle"
                        colorScheme={
                          note.generateType.toUpperCase() === "MCQ"
                            ? "teal"
                            : "purple"
                        }
                      >
                        {note.generateType.toUpperCase()}
                      </Tag>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <Pagination
              color="black"
              isDisabled={notes.length === 0}
              totalCount={totalNotesCount}
              pageSize={pageSize}
              currentPage={currentMarketPage}
              onPageChange={setCurrentMarketPage}
            />
          </>
        ) : (
          <Text textAlign="center" paddingTop="5">
            No notes found
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default MarketList;
