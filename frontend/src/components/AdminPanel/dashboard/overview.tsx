import React from 'react';
import type { Book, AuthorWithBooks } from '../../../types/adminPanel';

interface OverviewProps {
    books: Book[];
    authors: AuthorWithBooks[];
}

export const Overview: React.FC<OverviewProps> = ({ books, authors }) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-gray-600 mb-6">Library management system statistics</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{books.length}</div>
                    <div className="text-gray-600">Total Books</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{authors.length}</div>
                    <div className="text-gray-600">Total Authors</div>
                </div>
            </div>
            <h2 className="text-xl font-bold mb-4">Recent Books</h2>
            <div className="space-y-3">
                {books.slice(0, 5).map((book) => (
                    <div key={book.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                        {book.book_cover_image && (
                            <img src={book.book_cover_image} alt={book.book_title} className="w-16 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1">
                            <div className="font-semibold">{book.book_title}</div>
                            <div className="text-sm text-gray-600">ISBN: {book.isbn}</div>
                            <div className="text-sm text-gray-600">
                                {book.authors.map((a) => `${a.author_first_name} ${a.author_last_name}`).join(', ')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};