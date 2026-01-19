import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getRecommendations } from "../apis/recommendation";
import type { BookItem } from "../types/favoriteBooks";
import { handleAddClick } from "../utils/optionsclick";

export function Dashboard() {
  const [allRecommendedBooks, setAllRecommendedBooks] = useState<BookItem[]>(
    [],
  );
  const [displayedBooks, setDisplayedBooks] = useState<BookItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const authContext = useContext(UserContext)?.contextState;
  const navigation = useNavigate();

  const BOOKS_TO_SHOW = 6;

  useEffect(() => {
    if (!authContext?.loggedIn) navigation("/login");
    console.log("running");
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const favoriteList = await getRecommendations(authContext?.id);
        console.log(favoriteList.data);
        setAllRecommendedBooks(favoriteList.data);
        setDisplayedBooks(favoriteList.data.slice(0, BOOKS_TO_SHOW));
        setCurrentIndex(BOOKS_TO_SHOW);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [authContext?.loggedIn, authContext?.id, navigation]);

  const handleAddOption = async (bookId: string, option: string) => {
    console.log(`Adding book ${bookId} to ${option}`);
    await handleAddClick(bookId, option);
    setOpenDropdown(null);

    // Remove the added book and add next one if available
    const updatedBooks = displayedBooks.filter((book) => book.id !== bookId);

    // If there are more books available, add the next one
    if (currentIndex < allRecommendedBooks.length) {
      const nextBook = allRecommendedBooks[currentIndex];
      setDisplayedBooks([...updatedBooks, nextBook]);
      setCurrentIndex(currentIndex + 1);
    } else {
      setDisplayedBooks(updatedBooks);
    }
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
              <div className="text-gray-600 text-sm">
                Showing {displayedBooks.length} of {allRecommendedBooks.length}
              </div>
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
                    {displayedBooks.length > 0 ? (
                      displayedBooks.map((book: BookItem) => (
                        <tr
                          key={book.id}
                          onClick={() => {
                            navigation(`/bookReview/${book.id}`);
                          }}
                          className="bg-white cursor-pointer hover:bg-gray-50"
                        >
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(
                                  openDropdown === book.id ? null : book.id,
                                );
                              }}
                              className="px-3 py-1 border border-gray-700 text-gray-700 hover:bg-gray-100"
                            >
                              Add
                            </button>
                            {openDropdown === book.id && (
                              <div className="absolute right-4 top-12 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-40">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddOption(book.id, "favorites");
                                  }}
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                >
                                  Add to Favorites
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddOption(book.id, "will-read");
                                  }}
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                >
                                  Add to Will Read
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddOption(
                                      book.id,
                                      "currently-reading",
                                    );
                                  }}
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                >
                                  Add to Currently Reading
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No more recommendations available
                        </td>
                      </tr>
                    )}
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
