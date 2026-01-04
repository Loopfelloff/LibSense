import axios from "axios";
import type { User } from "../types/profile";

const getUserProfile = async (userId: string): Promise<User> => {
  const response = await axios.get("http://localhost:5000/users/profile", {
    params: { userId },
    withCredentials: true,
  });
  return response.data.data;
};

const changePassword = async (newPassword: string): Promise<string> => {
  const response = await axios.post(
    "http://localhost:5000/users/profile/changepassword",
    {
      newPassword,
    },
    {
      withCredentials: true,
    },
  );

  return response.data.success;
};

const changeProfilePic = async (formdata: FormData) => {
  const response = await axios.post(
    "http://localhost:5000/users/profile/profilepicture/upload",
    formdata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    },
  );

  return response.data.success;
};
export { changeProfilePic, getUserProfile, changePassword };
