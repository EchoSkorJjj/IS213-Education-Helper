import { UserData } from "~types/data";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  googleAuth: () => void;
  appleAuth: () => void;
  signOut: () => void;
};
