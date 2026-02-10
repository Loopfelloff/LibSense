import React, { useState, useEffect, useRef } from 'react'
import { Plus, Eye, Edit, Users, Trash2, Search } from 'lucide-react'
import type { Book } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface BookListProps {
  onAdd: () => void
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onView: (book: Book) => void
  onManageAuthors: (book: Book) => void
}

export const BookList: React.FC<BookListProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onView,
  onManageAuthors
}) => {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastBookRef = useRef<HTMLDivElement | null>(null)

  // Fetch books function
  const fetchBooks = async (pageNum: number) => {
    setLoading(true)
    try {
      const data = await api.getAllBooks(pageNum, 10)
      
      if (data.success) {
        if (pageNum === 1) {
          setBooks(data.books)
        } else {
          // Filter out duplicates before adding
          setBooks(prev => {
            const existingIds = new Set(prev.map((b: Book) => b.id))
            const newBooks = data.books.filter((b: Book) => !existingIds.has(b.id))
            return [...prev, ...newBooks]
          })
        }
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    }
    setLoading(false)
  }

  // Search books with vector similarity
  const searchBooksWithVector = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      setPage(1)
      fetchBooks(1)
      return
    }

    setLoading(true)
    setIsSearching(true)
    try {
      const data = await api.searchBooks(query)
      
      if (data.success && data.recommendations) {
        // Map the recommendations to match Book format
        const searchResults = await Promise.all(
          data.recommendations.map(async (rec: any) => {
            try {
              const bookDetail = await api.getBookDetail(rec.id)
              return bookDetail
            } catch (error) {
              console.error(`Error fetching book detail for ${rec.id}:`, error)
              return null
            }
          })
        )
        
        // Filter out any null results
        setBooks(searchResults.filter((book): book is Book => book !== null))
        setHasMore(false) // Disable pagination for search results
      }
    } catch (error) {
      console.error('Error searching books:', error)
    }
    setLoading(false)
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchBooksWithVector(search)
    }
  }

  // Handle search button click
  const handleSearchClick = () => {
    searchBooksWithVector(search)
  }

  // Initial load
  useEffect(() => {
    fetchBooks(1)
  }, [])

  // Intersection observer for lazy loading (only when not searching)
  useEffect(() => {
    if (loading) return
    if (!hasMore) return
    if (isSearching) return // Don't use infinite scroll during search

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })

    if (lastBookRef.current) {
      observer.current.observe(lastBookRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [loading, hasMore, isSearching])

  // Fetch new page (only when not searching)
  useEffect(() => {
    if (page > 1 && !isSearching) {
      fetchBooks(page)
    }
  }, [page, isSearching])

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await onDelete(id)
      setBooks(prev => prev.filter(book => book.id !== id))
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus size={20} />
          Add Book
        </button>
      </div>

      <div className="relative mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search books using AI (e.g., 'fantasy with dragons', 'mystery thriller')... Press Enter to search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {loading && isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        <button
          onClick={handleSearchClick}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </div>

      <div className="space-y-4">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div
              key={book.id}
              ref={index === books.length - 1 ? lastBookRef : null}
              className="border border-gray-200 rounded-lg p-4 flex gap-4 bg-white shadow-sm hover:shadow-md transition"
            >
              {book.book_cover_image ? (
                <img
                  src={book.book_cover_image}
                  alt={book.book_title}
                  className="w-24 h-32 object-cover rounded shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg text-gray-900 mb-1">{book.book_title}</div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Authors:</span>{' '}
                  {book.authors && book.authors.length > 0 ? (
                    book.authors.map((author) =>
                      `${author.author_first_name}${author.author_middle_name ? ` ${author.author_middle_name}` : ''} ${author.author_last_name}`
                    ).join(', ')
                  ) : (
                    <span className="text-gray-400">No authors</span>
                  )}
                </div>
                {book.description && (
                  <div className="text-sm text-gray-500 line-clamp-2">{book.description}</div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => onView(book)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                  title="Edit Book"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onManageAuthors(book)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                  title="Manage Authors"
                >
                  <Users size={18} />
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className={`p-2 rounded transition ${deleteConfirm === book.id
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 hover:bg-red-50'
                    }`}
                  title={deleteConfirm === book.id ? 'Click again to confirm' : 'Delete Book'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            {search ? (
              <>
                <Search size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-lg">No books found matching "{search}"</p>
              </>
            ) : (
              <>
                <Plus size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-lg">No books available</p>
                <button
                  onClick={onAdd}
                  className="mt-4 text-blue-600 hover:underline font-medium"
                >
                  Add your first book
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {loading && !isSearching && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {books.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {books.length} book{books.length !== 1 ? 's' : ''}
          {isSearching && ' (AI-powered search results)'}
        </div>
      )}
    </div>
  )
}
