import React, { useState } from 'react';
import { api } from '../../../apis/adminApi';

interface AddAuthorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddAuthorForm: React.FC<AddAuthorFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    author_first_name: '',
    author_middle_name: '',
    author_last_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.addAuthor({
        author_first_name: formData.author_first_name.trim(),
        author_middle_name: formData.author_middle_name.trim() || null,
        author_last_name: formData.author_last_name.trim(),
      });

      // Reset form on success
      setFormData({
        author_first_name: '',
        author_middle_name: '',
        author_last_name: '',
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add author');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Author</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">First Name*</label>
        <input
          type="text"
          required
          value={formData.author_first_name}
          onChange={(e) => setFormData({ ...formData, author_first_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter first name"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Middle Name</label>
        <input
          type="text"
          value={formData.author_middle_name}
          onChange={(e) => setFormData({ ...formData, author_middle_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter middle name (optional)"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Last Name*</label>
        <input
          type="text"
          required
          value={formData.author_last_name}
          onChange={(e) => setFormData({ ...formData, author_last_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter last name"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Author...' : 'Add Author'}
        </button>
        <button 
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};