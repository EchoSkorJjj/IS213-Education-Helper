import { UserData } from "~types/data";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  authorization: string | null;
  googleAuth: () => void;
  sgIdGetAuthUrl: () => void;
  sgIdAuth: () => void;
  signOut: () => void;
  generateNotes: (file: File, generateType: string) => void;
  retrieveAndUpdateUserInfo: () => void;
};
