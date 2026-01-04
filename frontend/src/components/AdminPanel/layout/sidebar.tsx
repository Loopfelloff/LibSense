import React from 'react';
import { Book, Users, Search } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav>
        <button
          onClick={() => setActiveView('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
            activeView === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Search size={20} />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveView('books')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
            activeView === 'books' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Book size={20} />
          <span>Manage Books</span>
        </button>
        <button
          onClick={() => setActiveView('authors')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
            activeView === 'authors' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users size={20} />
          <span>Manage Authors</span>
        </button>
      </nav>
    </div>
  );
};