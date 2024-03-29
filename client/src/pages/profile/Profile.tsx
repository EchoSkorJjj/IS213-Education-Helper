import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box } from "@chakra-ui/react";

import NotesList from "./components/NotesList";
import ProfileHeader from "./components/ProfileHeader";

import { getUserNotes } from "~util";

interface NotesProp {
  unique_id: string;
  topic: string;
  title: string;
  imageURL: string;
  creator: string;
  type: "MCQ" | "Flashcard";
}


const Profile = () => {
  // For created notes
  const [createdNotes, setCreatedNotes] = useState<NotesProp[]>([]);
  const [totalCreatedNotesCount, setTotalCreatedNotesCount] =
    useState<number>(1);
  const [createdNotesTitle, setCreatedNotesTitle] = useState<string>("");

  // For saved notes
  const [savedNotes, setSavedNotes] = useState<NotesProp[]>([]);
  const [totalSavedNotesCount, setTotalSavedNotesCount] = useState<number>(1);
  const [savedNotesTitle, setSavedNotesTitle] = useState<string>("");

  // For pagination
  const [currentCreatedNotePage, setCurrentCreatedNotePage] = useState(1);
  const [currentSavedNotePage, setCurrentSavedNotePage] = useState(1);

  const handleGetUserNotes = async (
    userNoteType: string,
    notesTitle: string,
    currentPage: number,
  ): Promise<void> => {
    const data = await getUserNotes(userNoteType, notesTitle, currentPage);

    if (userNoteType === "created") {
      setCreatedNotes(data.notes);
      setTotalCreatedNotesCount(data.totalNotesCount);
    } else if (userNoteType === "saved") {
      setSavedNotes(data.notes);
      setTotalSavedNotesCount(data.totalNotesCount);
    }
  };

  useEffect(() => {
    handleGetUserNotes("created", createdNotesTitle, currentCreatedNotePage);
  }, [createdNotesTitle, currentCreatedNotePage]);

  useEffect(() => {
    handleGetUserNotes("saved", savedNotesTitle, currentSavedNotePage);
  }, [savedNotesTitle, currentSavedNotePage]);

  return (
    <Box mb="5em">
      <Helmet>
        <title>Profile</title>
        <meta name="description" content="Profile" />
      </Helmet>
      <ProfileHeader />
      <NotesList
        notes={createdNotes}
        setNotesTitle={setCreatedNotesTitle}
        setCurrentPage={setCurrentCreatedNotePage}
        currentPage={currentCreatedNotePage}
        totalNotesCount={totalCreatedNotesCount}
        header="Created"
        description="View notes you generated"
      />
      <NotesList
        notes={savedNotes}
        setNotesTitle={setSavedNotesTitle}
        setCurrentPage={setCurrentSavedNotePage}
        currentPage={currentSavedNotePage}
        totalNotesCount={totalSavedNotesCount}
        header="Saved"
        description="View notes you saved"
      />
    </Box>
  );
};

export default Profile;
