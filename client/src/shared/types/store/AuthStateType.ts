import { UserData } from "~types/data";

export type AuthStateType = {
  isAuthenticated: boolean;
  user: UserData | null;
  authorization: string | null;
  login: (userData: UserData, authorization: string) => void;
  logout: () => void;
  authFlow: (authorization: string) => void;
};
