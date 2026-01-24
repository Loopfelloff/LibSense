import axios from "axios";

const getFavorites = async (page: number) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/users/books/favorites",
      {
        params: { page },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`Can't fetch favorites due to ${err.name}`);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
    }
    return { data: [], pagination: { totalPages: 0 } };
  }
};

const postFavorites = async (bookId: string) => {
  console.log(bookId);
  try {
    const response = await axios.post(
      "http://localhost:5000/users/books/favorites",
      {
        bookId,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`Can't fetch favorites due to ${err.name}`);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
    }
  }
};

const deleteFavorite = async (bookId: string) => {
  try {
    const response = await axios.delete(
      "http://localhost:5000/users/books/favorites",
      {
        params: { bookId },
        withCredentials: true,
      },
    );

    return response.data.success;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(`Can't fetch favorites due to ${err.name}`);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
    }
  }
};

export { getFavorites, deleteFavorite, postFavorites };
