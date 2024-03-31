import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { useToast } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";

import useAuthStore from "~shared/store/AuthStore";

import { api, handleResponse } from "~api";
import { MYINFO_CONFIG } from "~config";
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
  const {
    isAuthenticated,
    user,
    authorization,
    login,
    logout,
    authFlow,
    updateUserInfo,
  } = useAuthStore();
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
        const AUTHORIZATION_TOKEN = response.headers["x-access-token"];

        const data = await handleResponse(response);
        const userData = JSON.parse(data.payload.value);

        login(userData, AUTHORIZATION_TOKEN);
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

  const myInfoGetCode = async (): Promise<void> => {
    try {
      const response = await api.post(
        "/api/v1/auth/myInfo/generateCodeChallenge",
      );
      const result = response.data.code_challenge;
      const MYINFO_UNIQUE_ID = response.headers["x-myinfo-unique-id"];

      authFlow(MYINFO_UNIQUE_ID);

      const authorizeUrl =
        MYINFO_CONFIG.MYINFO_AUTH_API_URL +
        "?client_id=" +
        MYINFO_CONFIG.MYINFO_CLIENT_ID +
        "&scope=" +
        MYINFO_CONFIG.MYINFO_SCOPES +
        "&purpose_id=" +
        MYINFO_CONFIG.MYINFO_PURPOSE_ID +
        "&code_challenge=" +
        result +
        "&code_challenge_method=" +
        MYINFO_CONFIG.MYINFO_METHOD +
        "&redirect_uri=" +
        MYINFO_CONFIG.MYINFO_CALLBACK_URL;

      window.location.href = authorizeUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const myInfoAuth = async (): Promise<void> => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.error("Auth code is required");
        return;
      }

      const response = await api.post(
        "/api/v1/auth/myInfo/callback",
        {
          code: code,
        },
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        },
      );
      const AUTHORIZATION_TOKEN = response.headers["x-access-token"];

      const data = await handleResponse(response);
      const userData = JSON.parse(data.payload.value);

      login(userData, AUTHORIZATION_TOKEN);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const sgIdGetAuthUrl = async (): Promise<void> => {
    try {
      const response = await api.post("/api/v1/auth/sgId/generateAuthUrl");
      const AUTH_URL = response.data.auth_url;
      const SGID_UNIQUE_ID = response.headers["x-sgid-unique-id"];

      authFlow(SGID_UNIQUE_ID);

      window.location.href = AUTH_URL;
    } catch (error) {
      console.log(error);
    }
  };

  const sgIdAuth = async (): Promise<void> => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.error("Auth code is required");
        return;
      }

      const response = await api.post(
        "/api/v1/auth/sgId/callback",
        {
          code: code,
        },
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        },
      );
      const AUTHORIZATION_TOKEN = response.headers["x-access-token"];

      const data = await handleResponse(response);
      const userData = JSON.parse(data.payload.value);

      login(userData, AUTHORIZATION_TOKEN);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log(authorization);
      const response = await api.post(
        "/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        },
      );
      if (response.status === 200 && isAuthenticated) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateNotes = async (
    file: File,
    generateType: string,
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("generateType", generateType);
      formData.append("fileName", file.name);

      const response = await api.post("/api/v1/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await handleResponse(response);
      console.log(data);
      console.log(data.fileId);
      navigate(`/generated/${data.fileId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const retrieveAndUpdateUserInfo = async (): Promise<void> => {
    if (!user) return;
    const response = await api.get(`/api/v1/user/${user.user_id}`, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });

    const data = await handleResponse(response);
    const userData = JSON.parse(data.payload.value);
    updateUserInfo(userData);
  };

  return {
    isAuthenticated,
    user,
    authorization,
    googleAuth,
    myInfoGetCode,
    myInfoAuth,
    sgIdGetAuthUrl,
    sgIdAuth,
    signOut,
    generateNotes,
    retrieveAndUpdateUserInfo,
  };
};
