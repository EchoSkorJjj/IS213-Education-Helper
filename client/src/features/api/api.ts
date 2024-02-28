import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function handleResponse<T>(
  response: AxiosResponse<T>,
): Promise<T> {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(`HTTP error! Status: ${response.status}`);
}

export const getCheckoutUrl = async () => {
  try {
    const response = await api.get("/api/v1/payment/checkout");

    const data = await handleResponse(response);
    return data.url;
  } catch (error) {
    console.log(error);
  }
};

export const generateNotes = async (file: File, generateFlashcard: boolean) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      "/api/v1/notes/generate",
      {
        formData: formData,
        generateFlashcard: generateFlashcard,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getTopics = async () => {
  try {
    // const response = await api.get('/api/v1/notes/topics');

    // const data = await handleResponse(response);
    const data = [
      "All",
      "Data Science",
      "Business & Management",
      "Language",
      "Information Technology",
      "Film & Media",
      "Math & Logic",
      "Health & Medical",
      "Design & Creative",
      "Neil deGrasse Tyson",
      "Neil sharma",
      "Neil Gae",
    ];
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getNotes = async (
  topic: string,
  notesTitle: string,
  currentMarketPage: number,
) => {
  try {
    const response = await api.post("/api/v1/notes/get", {
      topic: topic,
      notesTitle: notesTitle,
      currentPage: currentMarketPage,
    });

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.log(error);
  }
};
