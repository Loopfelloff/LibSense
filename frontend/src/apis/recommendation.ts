import axios from "axios";

const getRecommendations = async (id) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/users/books/recommendations",
      {
        params: { id },
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
    return { data: [] };
  }
};

export { getRecommendations };
