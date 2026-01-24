export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  averageRating: number | null;
  genres: string[];
  authors: string[];
}
