import axios from 'axios';
import type { SearchResult } from '../types/searchResultTypes';

export const searchBooks = async (description: string): Promise<SearchResult[]> => {
  const response = await axios.post(
    'http://localhost:5000/genreClassification',
    { description },
    { withCredentials: true }
  );
  console.log(response.data.data)
  return response.data.data;
};

export const searchSimilarBooks = async (description: string) => {
  const response = await axios.post(
    'http://localhost:5000/books/search',
    { description },
    { withCredentials: true }
  );
  return response.data.data;
}
