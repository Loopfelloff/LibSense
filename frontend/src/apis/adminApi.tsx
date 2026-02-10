import type { Book, AuthorWithBooks } from "../types/adminPanel"

const API_BASE_URL = "http://localhost:5000/admin"

// helper to include credentials in every request
async function fetchWithCreds(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { credentials: "include", ...options })
  return handleResponse(res)
}

async function handleResponse(res: Response) {
  const data = await res.json()

  if (!res.ok) {
    console.log(data)
    throw new Error(data?.errMsg || data?.errName || "Request failed")
  }

  return data
}

interface AddBookPayload {
  isbn: string
  book_title: string
  description?: string
  authors: any[]
  book_cover_image?: File
}

interface UpdateBookPayload {
  isbn?: string
  book_title?: string
  description?: string
  book_cover_image?: File
}

export const api = {
  // ========== BOOKS ==========

  getAllBooks: async (page: number = 1, limit: number = 10): Promise<any> => {
    return fetchWithCreds(`${API_BASE_URL}/listBooks?page=${page}&limit=${limit}`)
  },

  searchBooks: async (query: string): Promise<any> => {
    return fetchWithCreds(`${API_BASE_URL}/searchBooks?query=${encodeURIComponent(query)}`)
  },

  getBookDetail: async (bookId: string): Promise<Book> => {
    const data = await fetchWithCreds(`${API_BASE_URL}/bookDetail/${bookId}`)
    return data.book
  },

  addBook: async (bookData: AddBookPayload) => {
    const formData = new FormData()

    formData.append("isbn", bookData.isbn)
    formData.append("book_title", bookData.book_title)
    if (bookData.description) formData.append("description", bookData.description)
    if (bookData.book_cover_image) formData.append("book_cover_image", bookData.book_cover_image)
    formData.append("authors", JSON.stringify(bookData.authors || []))

    return fetchWithCreds(`${API_BASE_URL}/addBook`, {
      method: "POST",
      body: formData,
    })
  },

  updateBook: async (bookId: string, bookData: UpdateBookPayload) => {
    const formData = new FormData()
    formData.append("book_id", bookId)
    if (bookData.isbn) formData.append("isbn", bookData.isbn)
    if (bookData.book_title) formData.append("book_title", bookData.book_title)
    if (bookData.description !== undefined) formData.append("description", bookData.description)
    if (bookData.book_cover_image) formData.append("book_cover_image", bookData.book_cover_image)

    return fetchWithCreds(`${API_BASE_URL}/updateBook`, {
      method: "PUT",
      body: formData,
    })
  },

  deleteBook: async (bookId: string) => {
    return fetchWithCreds(`${API_BASE_URL}/deleteBook/${bookId}`, { method: "DELETE" })
  },

  updateBookAuthors: async (bookId: string, authors: any[]) => {
    return fetchWithCreds(`${API_BASE_URL}/updateBookAuthors`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: bookId, authors }),
    })
  },

  // ========== AUTHORS ==========

  getAllAuthors: async (page: number = 1, limit: number = 10): Promise<any> => {
    return fetchWithCreds(`${API_BASE_URL}/listAuthors?page=${page}&limit=${limit}`)
  },

  getAuthorDetail: async (authorId: string): Promise<AuthorWithBooks> => {
    const data = await fetchWithCreds(`${API_BASE_URL}/authorDetail/${authorId}`)
    return data.author
  },

  addAuthor: async (authorData: any) => {
    return fetchWithCreds(`${API_BASE_URL}/addAuthor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authorData),
    })
  },

  updateAuthor: async (authorId: string, authorData: any) => {
    return fetchWithCreds(`${API_BASE_URL}/updateAuthor`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author_id: authorId, ...authorData }),
    })
  },

  deleteAuthor: async (authorId: string) => {
    return fetchWithCreds(`${API_BASE_URL}/deleteAuthor/${authorId}`, { method: "DELETE" })
  },

  fetchSuggestedAuthors: async (query: string) => {
    if (!query) return []
    return fetchWithCreds(`${API_BASE_URL}/getSuggestedAuthor?query=${encodeURIComponent(query)}`)
  },

  // ========== STATISTICS ==========

  getStatistics: async (): Promise<{ totalBooks: number; totalAuthors: number }> => {
    const data = await fetchWithCreds(`${API_BASE_URL}/statistics`)
    return data.statistics
  },
}

