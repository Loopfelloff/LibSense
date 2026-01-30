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
