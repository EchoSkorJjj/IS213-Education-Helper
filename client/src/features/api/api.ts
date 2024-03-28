import axios, { AxiosInstance, AxiosResponse } from "axios";

import {
  CreateTemporaryContentResponse,
  DeleteAllTemporaryContentsResponse,
  DeleteTemporaryContentsResponse,
  GetContentResponse,
  GetTemporaryContentsResponse,
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

export const getCheckoutUrl = async () => {
  const { authorization } = useAuth();
  try {
    const response = await api.get("/api/v1/payment/checkout", {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });

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
  const { authorization } = useAuth();
  try {
    const response = await api.post(
      "/api/v1/notes/get",
      {
        topic: topic,
        notesTitle: notesTitle,
        currentPage: currentMarketPage,
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
    const response = await api.get(
      `/api/v1/notes/${noteId}?user_id=7821c92e-2e29-4bb6-a890-edb8f7f11379`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      },
    );
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
  authorization: string,
  updatedContent: any,
): Promise<UpdateTemporaryContentsResponse | undefined> => {
  try {
    const response = await api.put("/api/v1/contents/temporary", {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      data: {
        note_id: noteId,
        content_id: contentId,
        content: updatedContent,
      },
    });

    return response.data as UpdateTemporaryContentsResponse;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTemporaryContent = async (
  noteId: string,
  contentId: string,
  authorization: string,
): Promise<DeleteTemporaryContentsResponse | undefined> => {
  try {
    const response = await api.delete("/api/v1/contents/temporary", {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      data: {
        note_id: noteId,
        content_id: contentId,
      },
    });

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
    const response = await api.delete("/api/v1/contents/temporary/all", {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      data: {
        note_id: noteId,
      },
    });

    return response.data as DeleteAllTemporaryContentsResponse;
  } catch (error) {
    console.error(error);
  }
};

export const createTemporaryContent = async (
  noteId: string,
  authorization: string,
  contentType: number,
  content: any,
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
      "/api/v1/contents/commit",
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
