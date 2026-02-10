import { createContext } from "react";
export type userContext = {
  loggedIn: boolean;
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  profilePicLink: string;
  userRole : string;
};
export type UserContextType = {
  contextState: userContext | null;
  setContextState: React.Dispatch<React.SetStateAction<userContext | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

