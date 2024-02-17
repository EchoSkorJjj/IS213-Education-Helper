import { UserData, UserRole } from "~types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  role: UserRole | null;
  googleAuth: () => void;
  checkServiceOne: () => void;
  checkServiceOnePong: () => void;
  checkServiceTwo: () => void;
  checkServiceThree: () => void;
  googleLogout: () => void;
}
