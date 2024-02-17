import { UserData, UserRole } from "~types";

export interface AuthStateType {
  isAuthenticated: boolean;
  user: UserData | null;
  role: UserRole | null;
  login: (userData: UserData, roleData: UserRole) => void;
  logout: () => void;
}
