import axios from "axios";
import type { User } from "../types/profile";

const getUserProfile = async (userId: string): Promise<User> => {
  const response = await axios.get("http://localhost:5000/users/profile", {
    params: { userId },
  });
  return response.data.data;
};

export { getUserProfile };
