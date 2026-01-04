import React, { useState } from 'react';

interface AddAuthorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AddAuthorForm: React.FC<AddAuthorFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    author_first_name: '',
    author_middle_name: '',
    author_last_name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      author_first_name: formData.author_first_name,
      author_middle_name: formData.author_middle_name || null,
      author_last_name: formData.author_last_name,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">First Name*</label>
        <input
          type="text"
          required
          value={formData.author_first_name}
          onChange={(e) => setFormData({ ...formData, author_first_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter first name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Middle Name</label>
        <input
          type="text"
          value={formData.author_middle_name}
          onChange={(e) => setFormData({ ...formData, author_middle_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter middle name (optional)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name*</label>
        <input
          type="text"
          required
          value={formData.author_last_name}
          onChange={(e) => setFormData({ ...formData, author_last_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter last name"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Author
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  );
}