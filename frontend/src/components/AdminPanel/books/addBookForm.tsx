import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { AuthorWithBooks } from '../../../types/adminPanel';

interface AddBookFormProps {
  authors: AuthorWithBooks[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ authors, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    isbn: '',
    book_title: '',
    description: '',
    authors: [] as any[],
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newAuthor, setNewAuthor] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
  });

  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);

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
    const authorsArray = [
      ...selectedAuthorIds.map((id) => ({ author_id: id })),
      ...(showNewAuthorForm && newAuthor.first_name && newAuthor.last_name
        ? [{ first_name: newAuthor.first_name, middle_name: newAuthor.middle_name || null, last_name: newAuthor.last_name }]
        : []),
    ];

    if (authorsArray.length === 0) {
      alert('Please select at least one author or add a new author');
      return;
    }

    onSubmit({ 
      ...formData, 
      authors: authorsArray,
      book_cover_image: coverImage 
    });
  };

  const toggleAuthor = (authorId: string) => {
    setSelectedAuthorIds((prev) => (prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId]));
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
          placeholder="Enter ISBN"
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
          placeholder="Enter book title"
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
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200">
              <Upload size={18} />
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows={3}
          placeholder="Enter book description"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Select Authors*</label>
        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2 mb-2">
          {authors.map((author) => (
            <label key={author.id} className="flex items-center gap-2 py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAuthorIds.includes(author.id)}
                onChange={() => toggleAuthor(author.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                {author.author_first_name} {author.author_middle_name} {author.author_last_name}
              </span>
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowNewAuthorForm(!showNewAuthorForm)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showNewAuthorForm ? 'Hide new author form' : '+ Add new author'}
        </button>
      </div>
      
      {showNewAuthorForm && (
        <div className="border border-gray-300 rounded p-3 space-y-3 bg-gray-50">
          <h4 className="font-medium text-sm">New Author</h4>
          <div>
            <label className="block text-sm mb-1">First Name*</label>
            <input
              type="text"
              value={newAuthor.first_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Middle Name</label>
            <input
              type="text"
              value={newAuthor.middle_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, middle_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Middle name (optional)"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name*</label>
            <input
              type="text"
              value={newAuthor.last_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Last name"
            />
          </div>
        </div>
      )}
      
      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Book
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  );
};