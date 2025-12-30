import { Star, BookmarkPlus, Eye } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  progress?: number;
  match?: number;
}

interface BookCardProps {
  book: Book;
  showProgress?: boolean;
  showMatch?: boolean;
}

export function BookCard({ book, showProgress, showMatch }: BookCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition">
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition">
            <BookmarkPlus className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Match Badge */}
        {showMatch && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full">
            {book.match}% Match
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="text-indigo-600 mb-1">{book.genre}</div>
        <h3 className="text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-gray-600 mb-3">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-700">{book.rating}</span>
        </div>

        {/* Progress Bar */}
        {showProgress && book.progress !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2 text-gray-600">
              <span>Progress</span>
              <span>{book.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Add to Library Button */}
        {showMatch && (
          <button className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Add to Library
          </button>
        )}
      </div>
    </div>
  );
}
