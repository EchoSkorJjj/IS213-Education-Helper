import { faker } from "@faker-js/faker";
import axios from "axios";

const topics = [
  "Data Science",
  "Business & Management",
  "Language",
  "Information Technology",
  "Film & Media",
  "Math & Logic",
  "Health & Medical",
  "Design & Creative",
];

const fetchImageURL = async (query: string) => {
  const url = `https://api.unsplash.com/search/photos?client_id=${import.meta.env.VITE_UNSPLASH_CLIENT_ID}&query=${query}&page=1`;

  try {
    const response = await axios.get(url);
    const imageURL = response.data.results[0]?.urls?.small;
    return imageURL;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
};

const generateNote = async (topic: string, notesTitle: string) => {
  const imageURL = await fetchImageURL(topic);
  let title = notesTitle + faker.lorem.words(2);
  title = title.charAt(0).toUpperCase() + title.slice(1);

  const creator = faker.person.fullName();
  return { topic, title, imageURL, creator };
};

export const fetchNotes = async (
  topic: string,
  notesTitle: string,
  currentMarketPage: number,
) => {
  const totalNotesCount = 100 - currentMarketPage + currentMarketPage;
  if (topic === "All") {
    const notes = await Promise.all(
      topics.map((topic) => generateNote(topic, notesTitle)),
    );
    return { notes: notes, totalNotesCount: totalNotesCount };
  } else {
    const specificTopicNotes = new Array(8).fill(null).map(async () => {
      return generateNote(topic, notesTitle);
    });

    // Since `map` returns an array of promises, use `Promise.all` to wait for all of them to resolve
    const notes = await Promise.all(specificTopicNotes);
    return { notes: notes, totalNotesCount: totalNotesCount };
  }
};
