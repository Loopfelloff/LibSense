// Author types matching backend response structure
export interface Author {
  id: string;
  author_first_name: string;
  author_middle_name: string | null;
  author_last_name: string;
}

// For the formatted author response from getAllAuthors
export interface AuthorWithBooks {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  books: Book[];
}

// Book types matching backend response structure
export interface Book {
  id: string;
  book_title: string;
  isbn: string;
  book_cover_image: string;
  description: string;
  authors: Author[];
}

// For book detail response
export interface BookDetail {
  id: string;
  book_title: string;
  isbn: string;
  book_cover_image: string;
  description: string;
  authors: Author[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  msg?: string;
  error?: string;
  errName?: string;
  errMsg?: string;
  data?: T;
}

export interface AddBookResponse extends ApiResponse<any> {
  book?: Book;
}

export interface AddAuthorResponse extends ApiResponse<any> {
  newAuthor?: Author;
}

export interface UpdateBookResponse extends ApiResponse<any> {
  updatedBook?: Book;
}

export interface UpdateAuthorResponse extends ApiResponse<any> {
  updatedAuthor?: Author;
}

// Suggested authors returned by your API
export interface SuggestedAuthor {
  id: string
  first_name: string
  middle_name: string | null
  last_name: string
  recentBooks: {
    title: string
    coverImage: string
  }[]
}
