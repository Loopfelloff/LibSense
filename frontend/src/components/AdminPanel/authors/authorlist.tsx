import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import type { AuthorWithBooks } from '../../../types/adminPanel';

interface AuthorListProps {
  authors: AuthorWithBooks[];
  onAdd: () => void;
  onEdit: (author: AuthorWithBooks) => void;
  onDelete: (id: string) => void;
  onView: (author: AuthorWithBooks) => void;
}

export const AuthorList: React.FC<AuthorListProps> = ({ authors, onAdd, onEdit, onDelete, onView }) => {
  const [search, setSearch] = useState('');
  
  const filteredAuthors = authors.filter((author) =>
    `${author.author_first_name} ${author.author_middle_name} ${author.author_last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Authors</h1>
        <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={20} />
          Add Author
        </button>
      </div>
      <input
        type="text"
        placeholder="Search authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
      />
      <div className="space-y-3">
        {filteredAuthors.map((author) => (
          <div key={author.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold text-lg">
                {author.author_first_name} {author.author_middle_name} {author.author_last_name}
              </div>
              <div className="text-sm text-gray-600">Books: {author.books.length}</div>
              {author.books.length > 0 && (
                <div className="text-sm text-gray-500 mt-1">
                  {author.books.slice(0, 3).map((b) => b.book_title).join(', ')}
                  {author.books.length > 3 && ` +${author.books.length - 3} more`}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onView(author)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View Details">
                <Eye size={18} />
              </button>
              <button onClick={() => onEdit(author)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Edit Author">
                <Edit size={18} />
              </button>
              <button onClick={() => onDelete(author.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete Author">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredAuthors.length === 0 && <div className="text-center text-gray-500 py-8">No authors found</div>}
      </div>
    </div>
  );
};