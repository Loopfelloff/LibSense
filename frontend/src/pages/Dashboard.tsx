import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getRecommendations } from "../apis/recommendation";
import type { BookItem } from "../types/favoriteBooks";

export function Dashboard() {
  const [recommendedBooks, setRecommendedBooks] = useState<BookItem | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const authContext = useContext(UserContext)?.contextState;
  const navigation = useNavigate();

  useEffect(() => {
    if (!authContext?.loggedIn) navigation("/login");
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const favoriteList = await getRecommendations(authContext?.id);
        console.log(favoriteList.data);
        setRecommendedBooks(favoriteList.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleAddOption = (bookId: string, option: string) => {
    console.log(`Adding book ${bookId} to ${option}`);
    // Add your logic here to handle the selected option
    setOpenDropdown(null);
  };

  return (
    <>
      <div className="bg-gray-50 border-b mt-2 border-gray-300 px-4 py-4">
        <h1 className="text-gray-900 text-lg font-semibold">Dashboard</h1>
        <div className="text-gray-600">Welcome, {authContext?.firstName}</div>
      </div>
      <div className="p-4 max-w-7xl">
        <section>
          <div className="border border-gray-300 rounded">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
              <div className="text-gray-900 font-medium">Recommended Books</div>
            </div>
            <div className="overflow-x-auto min-h-96 min-w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-96 w-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Book
                      </th>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Author
                      </th>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Genre
                      </th>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Rating
                      </th>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {recommendedBooks &&
                      recommendedBooks.map((book: BookItem) => (
                        <tr key={book.id} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-14 bg-gray-200 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-gray-900">
                                {book.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {book.authors[0]} {book.authors[1]}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {book.genres[0]}, {book.genres[1]}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            ⭐ {book.averageRating ? book.averageRating : 0}
                          </td>
                          <td className="px-4 py-3 relative">
                            <button
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === book.id ? null : book.id,
                                )
                              }
                              className="px-3 py-1 border border-gray-700 text-gray-700 hover:bg-gray-100"
                            >
                              Add
                            </button>
                            {openDropdown === book.id && (
                              <div className="absolute right-4 top-12 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-40">
                                <button
                                  onClick={() =>
                                    handleAddOption(book.id, "favorites")
                                  }
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                >
                                  Add to Favorites
                                </button>
                                <button
                                  onClick={() =>
                                    handleAddOption(book.id, "will-read")
                                  }
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                >
                                  Add to Will Read
                                </button>
                                <button
                                  onClick={() =>
                                    handleAddOption(
                                      book.id,
                                      "currently-reading",
                                    )
                                  }
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                >
                                  Add to Currently Reading
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
