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
  });
  return response.data.data;
};

export { getBooksByStatus };
