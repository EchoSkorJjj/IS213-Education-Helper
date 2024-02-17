import { useToast, UseToastOptions } from "@chakra-ui/react";
import { CodeResponse } from "@react-oauth/google";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

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

export function createErrorHandler(toast: ReturnType<typeof useToast>) {
  return (error: AxiosError) => {
    let toastOptions: UseToastOptions;

    if (error.response) {
      toastOptions = {
        title: "Error",
        description: error.response.data as string,
        status: "error",
        duration: 9000,
        isClosable: true,
      };
    } else if (error.request) {
      toastOptions = {
        title: "Error",
        description: "No response received from the server.",
        status: "error",
        duration: 9000,
        isClosable: true,
      };
    } else {
      toastOptions = {
        title: "Error",
        description: `Failed setting up the request: ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      };
    }

    toast(toastOptions);
  };
}

export function createGoogleErrorHandler(toast: ReturnType<typeof useToast>) {
  return (error: CodeResponse) => {
    let toastOptions: UseToastOptions;

    if (error.error_description) {
      toastOptions = {
        title: "Error",
        description: error.error_description
          ? error.error_description
          : "An error occurred.",
        status: "error",
        duration: 9000,
        isClosable: true,
      };
    } else {
      toastOptions = {
        title: "Error",
        description: `Failed setting up google request: ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      };
    }

    toast(toastOptions);
  };
}
