import axios from "axios";
import type { User } from "../types/profile";

const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get("http://localhost:5000/users/profile", {
      params: { userId },
      withCredentials: true,
    });
    return response.data.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`can't add the review due to ${err.name}`);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
    return null;
  }
};

const changePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/users/profile/changepassword",
      { newPassword },
      { withCredentials: true },
    );
    return response.data.success;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`can't add the review due to ${err.name}`);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
    return false;
  }
};

const changeProfilePic = async (formData: FormData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/users/profile/profilepicture/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`can't add the review due to ${err.name}`);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
    return false;
  }
};

const logOut = async () => {
  try {
    const response = await axios.get("http://localhost:5000/logout", {
      withCredentials: true,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`can't add the review due to ${err.name}`);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
    return null;
  }
}

export { changeProfilePic, getUserProfile, changePassword , logOut};
