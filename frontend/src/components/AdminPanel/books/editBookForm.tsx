import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
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
    description: book.description || '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(book.book_cover_image || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      book_cover_image: coverImage
    });
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
        <label className="block text-sm font-medium mb-1">Cover Image</label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="w-32 h-48 object-cover rounded border" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 w-fit">
            <Upload size={18} />
            <span>Choose New Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
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