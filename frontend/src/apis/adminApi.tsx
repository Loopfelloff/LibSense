import type { Book, AuthorWithBooks } from "../types/adminPanel"

const API_BASE_URL = "http://localhost:5000/admin"

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

  getAllBooks: async (): Promise<Book[]> => {
    const res = await fetch(`${API_BASE_URL}/listBooks`)
    const data = await handleResponse(res)
    return data.books
  },

  getBookDetail: async (bookId: string): Promise<Book> => {
    const res = await fetch(`${API_BASE_URL}/bookDetail/${bookId}`)
    const data = await handleResponse(res)
    return data.book
  },

  addBook: async (bookData: AddBookPayload) => {
    const formData = new FormData()

    formData.append("isbn", bookData.isbn)
    formData.append("book_title", bookData.book_title)

    if (bookData.description) {
      formData.append("description", bookData.description)
    }

    if (bookData.book_cover_image) {
      formData.append("book_cover_image", bookData.book_cover_image)
    }

    formData.append(
      "authors",
      JSON.stringify(bookData.authors || [])
    )

    const res = await fetch(`${API_BASE_URL}/addBook`, {
      method: "POST",
      body: formData,
    })

    return handleResponse(res)
  },

  updateBook: async (bookId: string, bookData: UpdateBookPayload) => {
    const formData = new FormData()

    formData.append("book_id", bookId)

    if (bookData.isbn) formData.append("isbn", bookData.isbn)
    if (bookData.book_title) formData.append("book_title", bookData.book_title)

    if (bookData.description !== undefined) {
      formData.append("description", bookData.description)
    }

    if (bookData.book_cover_image) {
      formData.append("book_cover_image", bookData.book_cover_image)
    }

    const res = await fetch(`${API_BASE_URL}/updateBook`, {
      method: "PUT",
      body: formData,
    })

    return handleResponse(res)
  },

  deleteBook: async (bookId: string) => {
    const res = await fetch(`${API_BASE_URL}/deleteBook/${bookId}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },

  updateBookAuthors: async (bookId: string, authors: any[]) => {
    const res = await fetch(`${API_BASE_URL}/updateBookAuthors`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: bookId, authors }),
    })

    return handleResponse(res)
  },

  ///////////////////////////////////////////////////


  getAllAuthors: async (): Promise<AuthorWithBooks[]> => {
    const res = await fetch(`${API_BASE_URL}/listAuthors`)
    const data = await handleResponse(res)
    return data.authors
  },

  getAuthorDetail: async (authorId: string): Promise<AuthorWithBooks> => {
    const res = await fetch(`${API_BASE_URL}/authorDetail/${authorId}`)
    const data = await handleResponse(res)
    return data.author
  },

  addAuthor: async (authorData: any) => {
    const res = await fetch(`${API_BASE_URL}/addAuthor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authorData),
    })

    return handleResponse(res)
  },

  updateAuthor: async (authorId: string, authorData: any) => {
    const res = await fetch(`${API_BASE_URL}/updateAuthor`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author_id: authorId, ...authorData }),
    })

    return handleResponse(res)
  },

  deleteAuthor: async (authorId: string) => {
    const res = await fetch(`${API_BASE_URL}/deleteAuthor/${authorId}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },

  fetchSuggestedAuthors: async (query: string) => {
    if (!query) return []
    const res = await fetch(`${API_BASE_URL}/getSuggestedAuthor?query=${encodeURIComponent(query)}`)

    return handleResponse(res)

  },
}
