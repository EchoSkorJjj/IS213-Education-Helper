import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, useToast } from "@chakra-ui/react";

import {
  getCreatedNotes,
  getSavedNotesWithFilter,
  getTopics,
} from "~features/api";
import { useAuth } from "~features/auth";

import NotesList from "./components/NotesList";
import ProfileHeader from "./components/ProfileHeader";

import { NotePreview, Topic } from "~types/data";

const Profile = () => {
  // For created notes
  const [createdNotes, setCreatedNotes] = useState<NotePreview[]>([]);
  const [totalCreatedNotesCount, setTotalCreatedNotesCount] =
    useState<number>(1);
  const [createdNotesTitle, setCreatedNotesTitle] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);

  // For saved notes
  const [savedNotes, setSavedNotes] = useState<NotePreview[]>([]);
  const [totalSavedNotesCount, setTotalSavedNotesCount] = useState<number>(1);
  const [savedNotesTitle, setSavedNotesTitle] = useState<string>("");

  // For pagination
  const [currentCreatedNotePage, setCurrentCreatedNotePage] = useState(1);
  const [currentSavedNotePage, setCurrentSavedNotePage] = useState(1);

  const { user, authorization } = useAuth();
  const userId = user?.user_id;

  const toast = useToast();

  const handleGetUserCreatedNotes = async () => {
    if (!authorization || !userId) {
      return;
    }
    const data = await getCreatedNotes(
      authorization,
      userId,
      4,
      0,
      currentCreatedNotePage,
      createdNotesTitle,
    );
    if (!data) {
      setCreatedNotes([]);
      setTotalCreatedNotesCount(0);
      return;
    }
    setCreatedNotes(data.notes);
    setTotalCreatedNotesCount(data.count);
  };

  const handleGetUserSavedNotes = async () => {
    if (!authorization || !userId) {
      return;
    }
    const data = await getSavedNotesWithFilter(
      authorization,
      userId,
      4,
      0,
      currentSavedNotePage,
      savedNotesTitle,
    );
    if (!data || data.length === 0) {
      setSavedNotes([]);
      setTotalSavedNotesCount(0);
      return;
    }
    setSavedNotes(data.notes);
    setTotalSavedNotesCount(data.count);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await getTopics();
      if (!fetchedTopics || fetchedTopics.length === 0) {
        toast({
          title: "Failed to fetch topics",
          status: "error",
          position: "top",
          duration: 3000,
        });
        return;
      }
      setTopics(fetchedTopics);
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    handleGetUserCreatedNotes();
  }, [currentCreatedNotePage, createdNotesTitle]);

  useEffect(() => {
    handleGetUserSavedNotes();
  }, [currentSavedNotePage, savedNotesTitle]);

  return (
    <Box mb="5em">
      <Helmet>
        <title>Your Notes</title>
        <meta name="description" content="Your Notes" />
      </Helmet>
      <ProfileHeader />
      <NotesList
        notes={createdNotes}
        topics={topics}
        setNotesTitle={setCreatedNotesTitle}
        setCurrentPage={setCurrentCreatedNotePage}
        currentPage={currentCreatedNotePage}
        totalNotesCount={totalCreatedNotesCount}
        header="Created"
        description="View notes you generated"
      />
      <NotesList
        notes={savedNotes}
        topics={topics}
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
