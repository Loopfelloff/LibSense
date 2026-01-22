import axios from 'axios';

export type SearchResult = {
  id: string;
  book_title: string;
  book_cover_image: string;
  avg_book_rating: number;
  book_rating_count: number;
  book_genres: {
    genre: {
      genre_name: string;
    };
  }[];
};

export const searchBooks = async (description: string): Promise<SearchResult[]> => {
  const response = await axios.post(
    'http://localhost:5000/genreClassification',
    { description },
    { withCredentials: true }
  );
  return response.data.data;
};
