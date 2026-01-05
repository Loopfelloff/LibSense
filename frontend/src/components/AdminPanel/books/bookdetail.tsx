import React from 'react';
import { X } from 'lucide-react';
import type { Book } from '../../../types/adminPanel';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onClose }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {book.book_cover_image && (
          <div className="flex justify-center bg-gray-50 p-4 rounded">
            <img 
              src={book.book_cover_image} 
              alt={book.book_title} 
              className="max-w-xs max-h-96 object-contain rounded shadow-md" 
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
          <div className="text-lg font-semibold text-gray-900">{book.book_title}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">ISBN</label>
          <div className="text-gray-800">{book.isbn}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Authors</label>
          <div className="space-y-2">
            {book.authors && book.authors.length > 0 ? (
              book.authors.map((author) => (
                <div key={author.id} className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded">
                  <span className="font-medium text-gray-900">
                    {author.author_first_name}
                    {author.author_middle_name && ` ${author.author_middle_name}`}
                    {' '}{author.author_last_name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No authors listed</p>
            )}
          </div>
        </div>

        {book.description && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded">
              {book.description}
            </div>
          </div>
        )}

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