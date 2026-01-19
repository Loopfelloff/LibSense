import axios from "axios";
import type { Book } from "../types/books";
const getBooksByStatus = async (
  userId: string,
  status: string,
): Promise<Book[]> => {
  const response = await axios.get("http://localhost:5000/users/books/status", {
    params: {
      userId,
      type: status,
    },
    withCredentials: true,
  });
  return response.data.data;
};

const postBooksByStatus = async (bookId: string, status: string) => {
  const response = await axios.post(
    "http://localhost:5000/users/books/status",
    {
      bookId,
      type: status,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};
export { getBooksByStatus, postBooksByStatus };
