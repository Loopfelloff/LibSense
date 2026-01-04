import React, { useState } from 'react';
import type { Book, AuthorWithBooks } from '../../../types/adminPanel';

interface ManageBookAuthorsFormProps {
    book: Book;
    allAuthors: AuthorWithBooks[];
    onSubmit: (authors: any[]) => void;
    onCancel: () => void;
}

export const ManageBookAuthorsForm: React.FC<ManageBookAuthorsFormProps> = ({ book, allAuthors, onSubmit, onCancel }) => {
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(book.authors.map((a) => a.id));
    const [newAuthor, setNewAuthor] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
    });
    const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const authorsArray = [
            ...selectedAuthorIds.map((id) => ({ author_id: id })),
            ...(showNewAuthorForm && newAuthor.first_name && newAuthor.last_name
                ? [{ first_name: newAuthor.first_name, middle_name: newAuthor.middle_name || null, last_name: newAuthor.last_name }]
                : []),
        ];

        if (authorsArray.length === 0) {
            alert('Please select at least one author');
            return;
        }

        onSubmit(authorsArray);
    };

    const toggleAuthor = (authorId: string) => {
        setSelectedAuthorIds((prev) => (prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId]));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <h3 className="font-medium mb-2">Book: {book.book_title}</h3>
                <p className="text-sm text-gray-600 mb-4">Select authors for this book</p>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Authors</label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 mb-2">
                    {allAuthors.map((author) => (
                        <label key={author.id} className="flex items-center gap-2 py-2 hover:bg-gray-50 px-2 rounded cursor-pointer">
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
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Middle Name</label>
                        <input
                            type="text"
                            value={newAuthor.middle_name}
                            onChange={(e) => setNewAuthor({ ...newAuthor, middle_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Last Name*</label>
                        <input
                            type="text"
                            value={newAuthor.last_name}
                            onChange={(e) => setNewAuthor({ ...newAuthor, last_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            )}
            <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Update Authors
                </button>
                <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
                    Cancel
                </button>
            </div>
        </form>
    );
};