import { useEffect, useState , useContext} from "react";
import { Heart, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteFavorite, getFavorites } from "../apis/favorite.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import type { BookItem } from "../types/favoriteBooks.js";

export function Favorite() {
  const [favoriteBooks, setFavoriteBooks] = useState<BookItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const authContext = useContext(UserContext)?.contextState
  const navigation = useNavigate() 

  useEffect(() => {
    if(!authContext?.loggedIn){
	navigation("/login")
	return
    }
    if(authContext?.userRole === "SUPERADMIN"){
	navigation("/admin")
	return
    }
    const fetchFavorites = async () => {
      const favoriteList = await getFavorites(currentPage);
      console.log(favoriteList.data);
      setFavoriteBooks(favoriteList.data);
      setTotalPages(favoriteList.pagination.totalPages);
    };
    fetchFavorites();
  }, [currentPage]);

  const handleRemoveBook = async (id: string) => {
    setFavoriteBooks(favoriteBooks.filter((book) => book.id !== id));
    await deleteFavorite(id);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto p-6">
        {/* Books Count */}

        {/* Favorite Books List */}
        <div>
          <div className="flex items-center justify-between m-4">
            <h2 className="text-gray-900">
              Favorite Books (
              {favoriteBooks.length > 0 ? favoriteBooks.length : 0})
            </h2>
            {favoriteBooks.length > 0 && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-700 text-gray-700 hover:bg-gray-100 rounded"
              >
                {isEditing ? "Done" : "Edit"}
              </button>
            )}
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
                      <th className="px-4 py-3 text-left text-gray-700">
                        Genre
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700">
                        Rating
                      </th>
                      {isEditing && (
                        <th className="px-4 py-3 text-left text-gray-700">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-300">
                    {favoriteBooks.map((book) => (
                      <tr
                        key={book.id}
                        className="bg-white cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          navigation(`/bookReview/${book.id}`);
                        }}
                      >
                        {/* Book */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-12 h-16 object-cover bg-gray-200 border border-gray-300"
                            />
                            <span className="text-gray-900">{book.title}</span>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-4 py-3 text-gray-700">
                          {book.authors[0]} , {book.authors[1]}
                        </td>

                        {/* Genre */}
                        <td className="px-4 py-3 text-gray-700">
                          {book.genres[0]}, {book.genres[1]}
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-3 text-gray-700">
                          ⭐ {book.averageRating ? book.averageRating : 0}
                        </td>

                        {/* Actions */}
                        {isEditing && (
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveBook(book.id);
                              }}
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
