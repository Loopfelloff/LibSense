import React from 'react';
import type { Book } from '../../../types/adminPanel';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onClose }) => {
  return (
    <div className="space-y-4">
      {book.book_cover_image && (
        <div className="flex justify-center">
          <img src={book.book_cover_image} alt={book.book_title} className="max-w-xs max-h-96 object-contain rounded" />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
        <div className="text-lg font-semibold">{book.book_title}</div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">ISBN</label>
        <div>{book.isbn}</div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Authors</label>
        <div className="space-y-1">
          {book.authors.map((author) => (
            <div key={author.id} className="text-sm">
              {author.author_first_name} {author.author_middle_name} {author.author_last_name}
            </div>
          ))}
        </div>
      </div>
      {book.description && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <div className="text-sm text-gray-700">{book.description}</div>
        </div>
      )}
      <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
        Close
      </button>
    </div>
  );
};