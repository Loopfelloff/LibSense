import type { Book,AuthorWithBooks } from "../types/adminPanel"

const API_BASE_URL = 'http://localhost:5000/admin'

export const api = {
  
  getAllBooks: async (): Promise<Book[]> => {
    const res = await fetch(`${API_BASE_URL}/listBooks`)
    const data = await res.json()
    return data.books
  },
  
  getBookDetail: async (bookId: string): Promise<Book> => {
    const res = await fetch(`${API_BASE_URL}/bookDetail/${bookId}`)
    const data = await res.json()
    return data.book
  },
  
  addBook: async (bookData: any) => {
    const res = await fetch(`${API_BASE_URL}/addBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    })
    return res.json()
  },
  
  updateBook: async (bookId: string, bookData: any) => {
    const res = await fetch(`${API_BASE_URL}/updateBook`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId, ...bookData }),
    })
    return res.json()
  },
  
  deleteBook: async (bookId: string) => {
    const res = await fetch(`${API_BASE_URL}/deleteBook`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId }),
    })
    return res.json()
  },
  
  updateBookAuthors: async (bookId: string, authors: any[]) => {
    const res = await fetch(`${API_BASE_URL}/updateBookAuthors`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId, authors }),
    })
    return res.json()
  },
  
  // Authors
  getAllAuthors: async (): Promise<AuthorWithBooks[]> => {
    const res = await fetch(`${API_BASE_URL}/listAuthors`)
    const data = await res.json()
    return data.authors
  },
  
  getAuthorDetail: async (authorId: string): Promise<AuthorWithBooks> => {
    const res = await fetch(`${API_BASE_URL}/authorDetail/${authorId}`)
    const data = await res.json()
    return data.author
  },
  
  addAuthor: async (authorData: any) => {
    const res = await fetch(`${API_BASE_URL}/addAuthor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authorData),
    })
    return res.json()
  },
  
  updateAuthor: async (authorId: string, authorData: any) => {
    const res = await fetch(`${API_BASE_URL}/updateAuthor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_id: authorId, ...authorData }),
    })
    return res.json()
  },
  
  deleteAuthor: async (authorId: string) => {
    const res = await fetch(`${API_BASE_URL}/deleteAuthor`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_id: authorId }),
    })
    return res.json()
  },
}