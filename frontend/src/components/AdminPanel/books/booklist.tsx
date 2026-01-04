import React, { useState } from 'react';
import { Plus, Eye, Edit, Users, Trash2 } from 'lucide-react';
import type { Book } from '../../../types/adminPanel';

interface BookListProps {
  books: Book[];
  onAdd: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
  onManageAuthors: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onAdd, onEdit, onDelete, onView, onManageAuthors }) => {
  const [search, setSearch] = useState('');
  
  const filteredBooks = books.filter(
    (book) =>
      book.book_title.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase()) ||
      book.authors.some((a) => `${a.author_first_name} ${a.author_last_name}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={20} />
          Add Book
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by title, ISBN, or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
      />
      <div className="space-y-3">
        {filteredBooks.map((book) => (
          <div key={book.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
            {book.book_cover_image && (
              <img src={book.book_cover_image} alt={book.book_title} className="w-20 h-28 object-cover rounded" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-lg">{book.book_title}</div>
              <div className="text-sm text-gray-600 mb-1">ISBN: {book.isbn}</div>
              <div className="text-sm text-gray-600 mb-2">
                Authors: {book.authors.map((a) => `${a.author_first_name} ${a.author_last_name}`).join(', ')}
              </div>
              {book.description && <div className="text-sm text-gray-500 line-clamp-2">{book.description}</div>}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onView(book)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View Details">
                <Eye size={18} />
              </button>
              <button onClick={() => onEdit(book)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Edit Book">
                <Edit size={18} />
              </button>
              <button onClick={() => onManageAuthors(book)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="Manage Authors">
                <Users size={18} />
              </button>
              <button onClick={() => onDelete(book.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete Book">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && <div className="text-center text-gray-500 py-8">No books found</div>}
      </div>
    </div>
  );
};