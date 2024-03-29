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
import { Searchbar } from "@opengovsg/design-system-react";

import { Pagination } from "~components/pagination";

interface NotesProp {
  unique_id: string;
  topic: string;
  title: string;
  imageURL: string;
  creator: string;
}

interface NotesListProps {
  notes: NotesProp[];
  setNotesTitle: (notesTitle: string) => void;
  setCurrentPage: (pageNumber: number) => void;
  currentPage: number;
  totalNotesCount: number;
  header: string;
  description: string;
}

const NotesList = ({
  notes,
  setNotesTitle,
  setCurrentPage,
  currentPage,
  totalNotesCount,
  header,
  description,
}: NotesListProps) => {
  const pageSize = 8;

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
              onSearch={(value: string) => {
                setNotesTitle(value);
              }}
              isExpanded={true}
            />
          </Box>
        </Flex>
        <SimpleGrid
          columns={{ base: 2, lg: 4 }}
          spacing={5}
          paddingTop="5"
          paddingBottom="5"
        >
          {notes.map((note) => (
            <Card
              maxW="sm"
              maxH="sm"
              key={note.unique_id}
              as="button"
              border={0}
              rounded="0"
            >
              <Image
                objectFit="cover"
                src={
                  note.imageURL
                    ? note.imageURL
                    : `https://picsum.photos/200/300`
                }
                alt={note.title}
                borderRadius="lg"
                height="50%"
                width="100%"
                border={0}
                rounded="0"
              />

              <CardBody pl="4" p="0">
                <Stack
                  pt="1em"
                  pr="3em"
                  spacing="2"
                  direction="column"
                  textAlign="start"
                >
                  <Text>{note.topic}</Text>
                  <Text
                    fontSize={{ base: "2xl", md: "5xl", lg: "2xl" }}
                    fontWeight="bold"
                  >
                    {note.title}
                  </Text>

                  <Text color="gray.400">{note.creator}</Text>
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
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Flex>
    </Flex>
  );
};

export default NotesList;
