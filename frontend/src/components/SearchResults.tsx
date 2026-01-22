import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../apis/searchApi';
import { Star } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  onClose: () => void;
}

function SearchResults({ results, onClose }: SearchResultsProps) {
  const navigate = useNavigate();

  const handleBookClick = (bookId: string) => {
    navigate(`/bookReview/${bookId}`);
    onClose();
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 max-h-96 overflow-y-auto z-50">
        <div className="px-3 py-2 border-b border-gray-300 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">
            Books you might like
          </h3>
        </div>
        {results.map((book) => (
          <div
            key={book.id}
            onClick={() => handleBookClick(book.id)}
            className="flex gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
          >
            <img
              src={book.book_cover_image}
              alt={book.book_title}
              className="w-16 h-24 object-cover border border-gray-300"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-medium truncate">
                {book.book_title}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-700">
                  {book.avg_book_rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({book.book_rating_count})
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {book.book_genres.map((bg, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-gray-200 text-gray-700"
                  >
                    {bg.genre.genre_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchResults;
