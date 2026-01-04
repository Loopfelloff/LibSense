import React, { useState } from 'react';
import type { Book } from '../../../types/adminPanel';

interface EditBookFormProps {
  book: Book;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const EditBookForm: React.FC<EditBookFormProps> = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    isbn: book.isbn,
    book_title: book.book_title,
    book_cover_image: book.book_cover_image || '',
    description: book.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ISBN*</label>
        <input
          type="text"
          required
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Book Title*</label>
        <input
          type="text"
          required
          value={formData.book_title}
          onChange={(e) => setFormData({ ...formData, book_title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
        <input
          type="text"
          value={formData.book_cover_image}
          onChange={(e) => setFormData({ ...formData, book_cover_image: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows={4}
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Update Book
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  );
};