import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";

import useAuthStore from "~shared/store/AuthStore";

import {
  api,
  createErrorHandler,
  createGoogleErrorHandler,
  handleResponse,
} from "~api";
import { AuthContextType } from "~types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const useProvideAuth = (): AuthContextType => {
  const { isAuthenticated, user, role, login, logout } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();

  const googleAuth = useGoogleLogin({
    onSuccess: async ({ code }): Promise<void> => {
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 0);
        });

        const response = await api.post("/auth/google/callback", { code });

        // Handle the response using the provided function
        const data = await handleResponse(response);
        console.log(data);
        login(data.user, data.role);
        navigate("/dashboard");
      } catch (error) {
        createErrorHandler(toast)(error as AxiosError<unknown>); // using the modified errorHandler to use toast
      }
    },
    onError: (error): void => {
      createGoogleErrorHandler(toast)(error as CodeResponse); // using the modified errorHandler to use toast
    },
    flow: "auth-code",
  });

  const checkServiceOne = async (): Promise<void> => {
    try {
      const response = await api.get("/one/ping");
      console.log(response.data);
    } catch (error) {
      createErrorHandler(toast)(error as AxiosError<unknown>);
    }
  };

  const checkServiceOnePong = async (): Promise<void> => {
    try {
      const response = await api.get("/one/pong");
      console.log(response.data);
    } catch (error) {
      createErrorHandler(toast)(error as AxiosError<unknown>);
    }
  };

  const checkServiceTwo = async (): Promise<void> => {
    try {
      const response = await api.get("/two/ping");
      console.log(response.data);
    } catch (error) {
      createErrorHandler(toast)(error as AxiosError<unknown>);
    }
  };

  const checkServiceThree = async (): Promise<void> => {
    try {
      const response = await api.get("/three/ping");
      console.log(response.data);
    } catch (error) {
      createErrorHandler(toast)(error as AxiosError<unknown>);
    }
  };

  const googleLogout = async (): Promise<void> => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200 && isAuthenticated) {
        logout();
        navigate("/");
      }
    } catch (error) {
      createErrorHandler(toast)(error as AxiosError<unknown>);
    }
  };

  useEffect(() => {
    // Logic to  perform other initialization tasks
  }, [isAuthenticated, user, role]);

  return {
    isAuthenticated,
    user,
    role,
    googleAuth,
    checkServiceOne,
    checkServiceOnePong,
    checkServiceTwo,
    checkServiceThree,
    googleLogout,
  };
};
