export interface Author {
  id: string;
  author_first_name: string;
  author_middle_name?: string | null;
  author_last_name: string;
}

export interface Book {
  id: string;
  book_title: string;
  isbn: string;
  book_cover_image?: string | null;
  description?: string | null;
  authors: Author[];
}

export interface AuthorWithBooks extends Author {
  books: Omit<Book, 'authors'>[];
}