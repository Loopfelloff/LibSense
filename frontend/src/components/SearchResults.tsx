import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../apis/searchApi';
import { Star } from 'lucide-react';
import type { SimilarSearchBooks } from '../types/searchResultTypes';

interface SearchResultsProps {
  genreResults: SearchResult[];
  semanticResults: SimilarSearchBooks[];
  onClose: () => void;
}

function SearchResults({ semanticResults, genreResults, onClose }: SearchResultsProps) {
  const navigate = useNavigate();

  const handleBookClick = (bookId: string) => {
    navigate(`/bookReview/${bookId}`);
    onClose();
  };

  if (semanticResults.length === 0 && genreResults.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 max-h-96 overflow-y-auto shadow-lg">
      {/* Semantic Search Results Section */}
      {semanticResults.length > 0 && (
        <div>
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 sticky top-0">
            <h3 className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
              Similar Books
            </h3>
          </div>
          {semanticResults.map((book) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <img
                src={book.book_cover_image}
                alt={book.title}
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{book.title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{book.avg_book_rating.toFixed(1)}</span>
                  <span className="text-gray-400">({book.book_rating_count})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Genre Results Section */}
      {genreResults.length > 0 && (
        <div>
          <div className="bg-green-50 px-4 py-2 border-b border-green-200 sticky top-0">
            <h3 className="text-xs font-semibold text-green-900 uppercase tracking-wide">
              By Genre
            </h3>
          </div>
          {genreResults.map((book) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <img
                src={book.book_cover_image}
                alt={book.book_title}
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{book.book_title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{book.avg_book_rating.toFixed(1)}</span>
                  <span className="text-gray-400">({book.book_rating_count})</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {book.book_genres.map((bg, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                    >
                      {bg.genre.genre_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
