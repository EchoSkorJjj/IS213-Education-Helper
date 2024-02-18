import { UserData } from "~types/data";

export type AuthStateType = {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
};
