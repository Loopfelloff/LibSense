import React from 'react';
import type { AuthorWithBooks } from '../../../types/adminPanel';

interface AuthorDetailProps {
  author: AuthorWithBooks;
  onClose: () => void;
}

export const AuthorDetail: React.FC<AuthorDetailProps> = ({ author, onClose }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
        <div className="text-lg font-semibold">
          {author.author_first_name} {author.author_middle_name} {author.author_last_name}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Books by this Author ({author.books.length})</label>
        <div className="space-y-2">
          {author.books.length > 0 ? (
            author.books.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded p-3 flex gap-3">
                {book.book_cover_image && (
                  <img src={book.book_cover_image} alt={book.book_title} className="w-12 h-16 object-cover rounded" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{book.book_title}</div>
                  <div className="text-sm text-gray-600">ISBN: {book.isbn}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">No books by this author</div>
          )}
        </div>
      </div>
      <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
        Close
      </button>
    </div>
  );
};