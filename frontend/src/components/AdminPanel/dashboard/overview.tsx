import React from 'react'
import { BookOpen, Users, TrendingUp } from 'lucide-react'
import type { Book, AuthorWithBooks } from '../../../types/adminPanel'

interface OverviewProps {
  books: Book[]
  authors: AuthorWithBooks[]
}

export const Overview: React.FC<OverviewProps> = ({ books, authors }) => {
  // Calculate total books written by all authors
  const totalBooksFromAuthors = authors.reduce((sum, author) => sum + (author.books?.length || 0), 0)
  
  // Calculate average books per author
  const avgBooksPerAuthor = authors.length > 0 
    ? (totalBooksFromAuthors / authors.length).toFixed(1) 
    : '0'

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Library management system statistics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl font-bold text-blue-600">{books.length}</div>
            <BookOpen size={32} className="text-blue-500" />
          </div>
          <div className="text-gray-700 font-medium">Total Books</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl font-bold text-green-600">{authors.length}</div>
            <Users size={32} className="text-green-500" />
          </div>
          <div className="text-gray-700 font-medium">Total Authors</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl font-bold text-purple-600">{avgBooksPerAuthor}</div>
            <TrendingUp size={32} className="text-purple-500" />
          </div>
          <div className="text-gray-700 font-medium">Avg Books/Author</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={24} className="text-blue-600" />
          Recent Books
        </h2>
        
        {books.length > 0 ? (
          <div className="space-y-3">
            {books.slice(0, 5).map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition">
                {book.book_cover_image ? (
                  <img 
                    src={book.book_cover_image} 
                    alt={book.book_title} 
                    className="w-16 h-20 object-cover rounded shadow-sm flex-shrink-0" 
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 mb-1">{book.book_title}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Authors:</span>{' '}
                    {book.authors && book.authors.length > 0 ? (
                      book.authors.map((a) => 
                        `${a.author_first_name}${a.author_middle_name ? ` ${a.author_middle_name}` : ''} ${a.author_last_name}`
                      ).join(', ')
                    ) : (
                      <span className="text-gray-400">No authors</span>
                    )}
                  </div>
                  {book.description && (
                    <div className="text-xs text-gray-500 mt-2 line-clamp-1">
                      {book.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
            <p>No books in the library yet</p>
          </div>
        )}
      </div>
    </div>
  )
}