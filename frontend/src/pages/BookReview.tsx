import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Dashboard-Components/Navbar';
import Sidebar from '../components/Dashboard-Components/Sidebar';
import { UserContext } from '../context/UserContext';
import type { bookEntireDataType , bookWrittenBy} from '../types/bookEntireData';
import { getFullBookInfo } from '../apis/fullBookInfo';
// Mock data

export function BookReview() {
  let { bookId } = useParams();
  bookId = String(bookId)
  console.log(bookId);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isBookDetailLoading , setIsBookDetailLoading] = useState<boolean>(false)
  const [bookData, setBookData] = useState<bookEntireDataType | null>(null);
  const authContext = useContext(UserContext);
  const navigation = useNavigate();

  useEffect(() => {
    if (!authContext?.loggedIn) navigation('/login');
    getFullBookInfo(bookId, setIsBookDetailLoading)
    .then(resolve =>{
	console.log(resolve)
	setBookData(resolve)
    })
    .catch(err =>{
	console.log(err)
    })
  }, []);

  const getAuthorNames = () => {
    if (!bookData?.book_written_by) return '';
    return bookData.book_written_by.map((author: bookWrittenBy) => {
      const { author_first_name, author_middle_name, author_last_name } = author.book_author;
      return [author_first_name, author_middle_name, author_last_name]
        .filter(Boolean)
        .join(' ');
    }).join(', ');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="pt-[53px] flex">
        <Sidebar isOpen={sidebarOpen} selectValue="topRated" onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:pl-56">
          <div className="p-4 w-7xl">
            <section>
              {isBookDetailLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading book details...</p>
                  </div>
                </div>
              ) : bookData ? (
                <div className="max-w-5xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Book Cover */}
                    <div className="md:col-span-1">
                      <div className="bg-gray-200 aspect-[2/3] rounded-lg flex items-center justify-center">
                        {bookData.book_cover_image === "something for now" ? (
                          <div className="text-center p-6">
                            <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="text-gray-500 mt-2">No cover image</p>
                          </div>
                        ) : (
                          <img src={bookData.book_cover_image} alt={bookData.book_title} className="w-full h-full object-cover rounded-lg" />
                        )}
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="md:col-span-2">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{bookData.book_title}</h1>
                      
                      <p className="text-lg text-gray-600 mb-4">
                        by {getAuthorNames()}
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          ISBN: {bookData.isbn}
                        </span>
                      </div>

                      <div className="prose max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">About this book</h2>
                        <p className="text-gray-700 leading-relaxed">{bookData.description}</p>
                      </div>

                      {/* Authors Section */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                          {bookData.book_written_by.length > 1 ? 'Authors' : 'Author'}
                        </h2>
                        <div className="space-y-3">
                          {bookData.book_written_by.map((author: bookWrittenBy) => (
                            <div key={author.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {author.book_author.author_first_name[0]}
                                {author.book_author.author_last_name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {author.book_author.author_first_name}{' '}
                                  {author.book_author.author_middle_name && `${author.book_author.author_middle_name} `}
                                  {author.book_author.author_last_name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Book not found</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
