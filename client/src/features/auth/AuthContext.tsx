import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { useToast } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";

import useAuthStore from "~shared/store/AuthStore";

import { api, handleResponse } from "~api";
import { AuthContextType } from "~types/auth";

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
  const { isAuthenticated, user, login, logout } = useAuthStore();
  // const toast = useToast();
  const navigate = useNavigate();

  const googleAuth = useGoogleLogin({
    onSuccess: async ({ code }): Promise<void> => {
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 0);
        });

        const response = await api.post("/api/v1/auth/google/callback", {
          code,
        });

        // Handle the response using the provided function
        const data = await handleResponse(response);
        console.log(data);
        const userData = JSON.parse(data.payload.value);
        console.log(userData);
        login(data.user);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
    onError: (error): void => {
      console.log(error);
    },
    flow: "auth-code",
  });

  const appleAuth = async (): Promise<void> => {
    try {
      const code = "neil";
      const response = await api.post("/api/v1/auth/apple/callback", {
        code,
      });

      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const response = await api.post("/api/v1/user/logout");
      if (response.status === 200 && isAuthenticated) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isAuthenticated,
    user,
    googleAuth,
    appleAuth,
    signOut,
  };
};
