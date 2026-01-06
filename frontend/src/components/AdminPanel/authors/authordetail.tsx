import React from 'react';
import { X, BookOpen } from 'lucide-react';
import type { AuthorWithBooks } from '../../../types/adminPanel';

interface AuthorDetailProps {
  author: AuthorWithBooks;
  onClose: () => void;
}

export const AuthorDetail: React.FC<AuthorDetailProps> = ({ author, onClose }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Author Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <label className="block text-sm font-medium text-blue-800 mb-1">Full Name</label>
          <div className="text-xl font-semibold text-gray-900">
            {author.first_name}
            {author.middle_name && ` ${author.middle_name}`}
            {' '}{author.last_name}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Books by this Author ({author.books?.length || 0})
            </label>
          </div>
          
          <div className="space-y-3">
            {author.books && author.books.length > 0 ? (
              author.books.map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-3 flex gap-3 hover:shadow-md transition bg-white">
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
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">ISBN:</span> {book.isbn}
                    </div>
                    {book.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {book.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500">No books by this author yet</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-medium mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};