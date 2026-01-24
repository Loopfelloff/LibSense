import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./UserContext";
import { TailSpin } from "react-loader-spinner";
import type { userContext } from "./UserContext.tsx";
import axios from "axios";

type propType = {
  children: ReactNode;
};

export default function AuthContext({ children }: propType) {
  const [contextState, setContextState] = useState<userContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth", {
        withCredentials: true,
      })
      .then((response) => {
        setContextState(response.data.data);
        console.log("success");
        console.log(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data.data);
        setIsLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ contextState, setContextState }}>
      {isLoading ? <TailSpin /> : children}
    </UserContext.Provider>
  );
}
