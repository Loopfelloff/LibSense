import { useState , useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getTopRated } from '../apis/topRated';
import { TailSpin } from 'react-loader-spinner';

type topRatedBooksType = {
    avg_book_rating : number; 
    book_cover_image? : string;
    description : string;
    book_title : string;
    id : string;
    isbn : string;
}

export function TopRated() {
  const [topRatedBooks , setTopRatedBooks] = useState<topRatedBooksType[]>([])
  const [totalBooks , setTotalBooks] = useState<number>(0) 
  const [isLoading ,  setIsLoading] = useState<boolean>(false)
  const [startIndex , setStartIndex] = useState<number>(0)
  const authContext = useContext(UserContext)?.contextState
  const navigation = useNavigate() 
  
  useEffect(()=>{
    if(!authContext?.loggedIn) navigation('/login')	 
    getTopRated(startIndex , 10, setIsLoading )
    .then(resolve => {
      setTopRatedBooks(resolve?.data?.data)
      console.log(resolve?.data.data)
      console.log(resolve?.data?.meta)
      console.log(resolve?.data?.data)
      setTotalBooks(resolve?.data?.meta.total)
      setIsLoading(false)
    })
    .catch(err =>{
      console.log(err)
    })
  } , [startIndex])
  
  function changeStartIndex(index: number){
      if(isLoading) return
      setStartIndex((index * 10))
  }

  const totalPages = Math.ceil(totalBooks/10);
  const currentPage = startIndex / 10;

  return (
      <div className="pt-[53px] flex">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Top Rated Books</h1>
              <p className="text-gray-600 mt-1">Discover the highest rated books from our collection</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Book</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {(!isLoading) ? topRatedBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-200">
                              <img
                                src={(!book.book_cover_image || book.book_cover_image.trim() === '') ? 'default Image' : book.book_cover_image}
                                alt={book.book_title}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={()=>{navigation(`/bookReview/${book.id}`)}}
                              />
                            </div>
                            <span className="text-gray-900 font-medium text-sm">{book.book_title}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-gray-600 text-sm line-clamp-2">{book.description}</p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <span className="text-gray-900 font-semibold text-sm">{book.avg_book_rating.toFixed(1)}</span>
                          </div>
                        </td>
                      </tr>
                    )) : 
                      <tr>
                        <td colSpan={3} className="px-6 py-12">
                          <div className="flex justify-center items-center">
                            <TailSpin color="#3B82F6" height={40} width={40}/>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(startIndex + 10, totalBooks)}</span> of{' '}
                    <span className="font-medium">{totalBooks}</span> books
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeStartIndex(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0 || isLoading}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {new Array(totalPages).fill(0).map((_, index) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage = index === 0 || 
                                        index === totalPages - 1 || 
                                        (index >= currentPage - 1 && index <= currentPage + 1);
                        
                        const showEllipsis = (index === currentPage - 2 && currentPage > 2) ||
                                            (index === currentPage + 2 && currentPage < totalPages - 3);

                        if (showEllipsis) {
                          return <span key={index} className="px-3 py-2 text-gray-500">...</span>;
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={index}
                            onClick={() => changeStartIndex(index)}
                            disabled={isLoading}
                            className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                              currentPage === index
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => changeStartIndex(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1 || isLoading}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
  );
}
