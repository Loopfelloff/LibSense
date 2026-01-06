import React, { useState } from 'react'
import { Plus, Eye, Edit, Users, Trash2, Search } from 'lucide-react'
import type { Book } from '../../../types/adminPanel'

interface BookListProps {
  books: Book[]
  onAdd: () => void
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onView: (book: Book) => void
  onManageAuthors: (book: Book) => void
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView, 
  onManageAuthors 
}) => {
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const filteredBooks = books.filter((book) => {
    const searchLower = search.toLowerCase()
    
    // Search in title
    if (book.book_title.toLowerCase().includes(searchLower)) return true
    
    // Search in ISBN
    if (book.isbn.toLowerCase().includes(searchLower)) return true
    
    // Search in authors
    if (book.authors && book.authors.length > 0) {
      return book.authors.some((author) => {
        const fullName = `${author.author_first_name} ${author.author_middle_name || ''} ${author.author_last_name}`.toLowerCase()
        return fullName.includes(searchLower)
      })
    }
    
    return false
  })

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id)
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by title, ISBN, or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div 
              key={book.id} 
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
                  className={`p-2 rounded transition ${
                    deleteConfirm === book.id 
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

      {filteredBooks.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredBooks.length} of {books.length} book{books.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}