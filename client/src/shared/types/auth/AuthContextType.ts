import { UserData } from "~types/data";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  googleAuth: () => void;
  myInfoGetCode: () => void;
  myInfoAuth: () => void;
  sgIdGetAuthUrl: () => void;
  sgIdAuth: () => void;
  signOut: () => void;
};
