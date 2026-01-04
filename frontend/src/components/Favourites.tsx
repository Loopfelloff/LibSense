import { useState } from "react";
import { Heart, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface BookItem {
  id: number;
  title: string;
  author: string;
  cover: string;
}

export function MyLibrary() {
  const [favoriteBooks, setFavoriteBooks] = useState<BookItem[]>([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      cover:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      cover:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
    },
    {
      id: 6,
      title: "Brave New World",
      author: "Aldous Huxley",
      cover: "https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400",
    },
    {
      id: 7,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover:
        "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400",
    },
    {
      id: 8,
      title: "Animal Farm",
      author: "George Orwell",
      cover:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    },
    {
      id: 9,
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      cover:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400",
    },
    {
      id: 10,
      title: "Lord of the Flies",
      author: "William Golding",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    },
    {
      id: 11,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(favoriteBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = favoriteBooks.slice(startIndex, endIndex);

  const handleRemoveBook = (id: number) => {
    if (
      confirm("Are you sure you want to remove this book from your favorites?")
    ) {
      setFavoriteBooks(favoriteBooks.filter((book) => book.id !== id));
      // Adjust current page if needed
      const newTotalPages = Math.ceil(
        (favoriteBooks.length - 1) / booksPerPage,
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Books Count */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="text-gray-600">Total Books</div>
          <div className="text-gray-900">{favoriteBooks.length}</div>
        </div>

        {/* Favorite Books List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Favorite Books</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-700 text-gray-700 hover:bg-gray-100"
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>

          {favoriteBooks.length > 0 ? (
            <>
              <div className="bg-white border border-gray-300">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">
                        Book
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700">
                        Author
                      </th>
                      {isEditing && (
                        <th className="px-4 py-3 text-left text-gray-700">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {currentBooks.map((book) => (
                      <tr key={book.id} className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-12 h-16 object-cover bg-gray-200 border border-gray-300"
                            />
                            <span className="text-gray-900">{book.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {book.author}
                        </td>
                        {isEditing && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleRemoveBook(book.id)}
                              className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 border border-gray-300 ${
                          currentPage === page
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-300 p-8 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No favorite books yet</p>
              <p className="text-gray-500 mt-2">
                Add books to your favorites to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
