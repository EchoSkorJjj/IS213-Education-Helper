import {
  Box,
  Card,
  CardBody,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Text
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

interface MarketProps {
  notes: NotesProp[];
  setNotesTitle: (notesTitle: string) => void;
  setCurrentMarketPage: (pageNumber: number) => void;
  currentMarketPage: number;
  totalNotesCount: number;
}

const MarketList = ({
  notes,
  setNotesTitle,
  setCurrentMarketPage,
  currentMarketPage,
  totalNotesCount,
}: MarketProps) => {
  const pageSize = 8;

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
              style={{
                bg: "black",
              }}
              onSearch={(value: string) => {
                setNotesTitle(value);
              }}
            />
          </Box>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 3, lg: 4 }}
          spacing={5}
          paddingTop="5"
          paddingBottom="5"
        >
          {notes.map((note) => (
            <Card maxW="sm" maxH="sm" key={note.unique_id} as="button">
              <Image
                objectFit="cover"
                src={note.imageURL}
                alt={note.title}
                borderRadius="lg"
                height="50%"
                width="100%"
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
          currentPage={currentMarketPage}
          onPageChange={setCurrentMarketPage}
        />
      </Flex>
    </Flex>
  );
};

export default MarketList;
