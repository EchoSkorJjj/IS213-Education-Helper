import { UserData } from "~types/data";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  googleAuth: () => void;
  userStorageTest: () => void;
  signOut: () => void;
};
