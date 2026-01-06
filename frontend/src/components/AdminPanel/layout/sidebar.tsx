import React from 'react';
import { Book, Users, LayoutDashboard, Library } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'books', label: 'Manage Books', icon: Book },
    { id: 'authors', label: 'Manage Authors', icon: Users },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8 pb-4 border-b border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <Library size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">LibSense</h1>
        </div>
        <p className="text-xs text-gray-500 ml-9">Admin Panel</p>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
        <p>© 2025 LibSense</p>
        <p className="mt-1">Library Management System</p>
      </div>
    </div>
  );
};