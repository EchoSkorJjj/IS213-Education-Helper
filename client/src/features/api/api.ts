import axios, { AxiosInstance, AxiosResponse } from "axios";

import {
  CreatedNotesResponse,
  CreateTemporaryContentResponse,
  DeleteAllTemporaryContentsResponse,
  DeleteTemporaryContentsResponse,
  GetContentResponse,
  GetTemporaryContentsResponse,
  NotePreview,
  SaveNotesResponse,
  UpdateTemporaryContentsResponse,
} from "~shared/types/data";
import { UpdateProfileType } from "~shared/types/form";

import { useAuth } from "~features/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
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

export const getCheckoutUrl = async (email: string, authorization: string) => {
  try {
    const response = await api.post(
      "/api/v1/payment/checkout",
      {
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    const data = await handleResponse(response);
    return data.url;
  } catch (error) {
    console.log(error);
  }
};

export const generateNotes = async (file: File, generateType: string) => {
  const { authorization } = useAuth();
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("generateType", generateType);

    const response = await api.post(
      "/api/v1/notes/upload",
      {
        formData: formData,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
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
  // const { authorization } = useAuth();
  try {
    /*
     * const response = await api.get(
     *   '/api/v1/notes/topics',
     *   {
     *     headers: {
     *       Authorization: `Bearer ${authorization}`,
     *     },
     *   },
     * );
     */

    // const data = await handleResponse(response);

    const data: { value: string; label: string }[] = [
      { value: "all", label: "All" },
      { value: "science-technology", label: "Science and Technology" },
      { value: "history-culture", label: "History and Culture" },
      { value: "business-economics", label: "Business and Economics" },
      { value: "literature-arts", label: "Literature and Arts" },
      { value: "health-medicine", label: "Health and Medicine" },
      { value: "education-learning", label: "Education and Learning" },
      { value: "law-politics", label: "Law and Politics" },
      { value: "environment-geography", label: "Environment and Geography" },
      { value: "psychology-sociology", label: "Psychology and Sociology" },
      { value: "philosophy-ethics", label: "Philosophy and Ethics" },
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
  authorization: string,
) => {
  try {
    const response = await api.post(
      "/api/v1/notes/get",
      {
        topic: topic,
        notesTitle: notesTitle,
        page: currentMarketPage,
        limit: 8,
        offset: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (data: UpdateProfileType) => {
  const { authorization } = useAuth();
  try {
    const response = await api.patch("/api/v1/user/update", data, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });

    const responseData = await handleResponse(response);
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export const getContent = async (
  noteId: string,
  authorization: string,
): Promise<GetContentResponse | undefined> => {
  try {
    const response = await api.get(`/api/v1/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });
    const data = response.data as GetContentResponse;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getTemporaryContents = async (
  noteId: string,
  authorization: string,
): Promise<GetTemporaryContentsResponse | undefined> => {
  try {
    const response = await api.get(`/api/v1/contents/temporary`, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      params: {
        note_id: noteId,
      },
    });

    return response.data as GetTemporaryContentsResponse;
  } catch (error) {
    console.error(error);
  }
};

export const updateTemporaryContent = async (
  noteId: string,
  contentId: string,
  contentType: number,
  updatedContent: any,
  authorization: string,
): Promise<UpdateTemporaryContentsResponse | undefined> => {
  try {
    const response = await api.put(
      "/api/v1/contents/temporary",
      {
        note_id: noteId,
        content_id: contentId,
        content_type: contentType,
        content: updatedContent,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    return response.data as UpdateTemporaryContentsResponse;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTemporaryContent = async (
  noteId: string,
  contentId: string,
  contentType: string,
  authorization: string,
): Promise<DeleteTemporaryContentsResponse | undefined> => {
  try {
    const contentTypeAsNumber =
      contentType === "flashcard" ? "FLASHCARD" : "MCQ";
    const response = await api.delete(
      `/api/v1/contents/temporary?note_id=${noteId}&content_type=${contentTypeAsNumber}&content_id=${contentId}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    return response.data as DeleteTemporaryContentsResponse;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAllTemporaryContents = async (
  noteId: string,
  authorization: string,
): Promise<DeleteAllTemporaryContentsResponse | undefined> => {
  try {
    const response = await api.delete(
      `/api/v1/contents/temporary/all?note_id=${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    return response.data as DeleteAllTemporaryContentsResponse;
  } catch (error) {
    console.error(error);
  }
};

export const createTemporaryContent = async (
  noteId: string,
  contentType: number,
  content: any,
  authorization: string,
): Promise<CreateTemporaryContentResponse | undefined> => {
  try {
    const response = await api.post(
      "/api/v1/contents/temporary",
      {
        note_id: noteId,
        content_type: contentType,
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    return response.data as CreateTemporaryContentResponse;
  } catch (error) {
    console.error(error);
  }
};

export const commitTemporaryContents = async (
  noteId: string,
  title: string,
  topic: string,
  authorization: string,
): Promise<{ success: boolean } | undefined> => {
  try {
    const response = await api.post(
      "/api/v1/contents/temporary/commit",
      {
        note_id: noteId,
        title: title,
        topic: topic,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );

    return { success: response.data.success };
  } catch (error) {
    console.error(error);
  }
};

export const saveNotes = async (
  userId: string,
  fileId: string,
  authorization: string,
): Promise<SaveNotesResponse | undefined> => {
  try {
    const response = await api.post(
      "/api/v1/save-notes/save",
      {
        user_id: userId,
        file_ids: [fileId],
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );
    return response.data as SaveNotesResponse;
  } catch (error) {
    console.error(error);
  }
};

export const deleteSavedNote = async (
  userId: string,
  fileId: string,
  authorization: string,
): Promise<{ success: boolean } | undefined> => {
  try {
    const response = await api.post(
      "/api/v1/save-notes/delete",
      {
        user_id: userId,
        file_id: fileId,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );
    return response.data.success;
  } catch (error) {
    console.log(error);
  }
};

export const getSavedNotes = async (authorization: string, userId: string) => {
  try {
    const response = await api.get(`/api/v1/notes/saved/${userId}`, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });

    return response.data.notes;
  } catch (error) {
    console.log(error);
  }
};

export const getCreatedNotes = async (
  authorization: string,
  userId: string,
  limit: number,
  offset: number,
  page: number,
  notesTitle: string,
) => {
  try {
    const response = await api.get(
      `/api/v1/notes/user/${userId}?limit=${limit}&offset=${offset}&page=${page}&notesTitle=${notesTitle}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSavedNotesWithFilter = async (
  authorization: string,
  userId: string,
  limit: number,
  offset: number,
  page: number,
  notesTitle: string,
) => {
  try {
    const response = await api.get(
      `/api/v1/notes/user/saved/${userId}?limit=${limit}&offset=${offset}&page=${page}&notesTitle=${notesTitle}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
