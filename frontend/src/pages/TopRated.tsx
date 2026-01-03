import { useState , useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Dashboard-Components/Navbar';
import Sidebar from '../components/Dashboard-Components/Sidebar';
import { UserContext } from '../context/UserContext';
import { getTopRated } from '../apis/topRated';
import { TailSpin } from 'react-loader-spinner';
// Mock data for books
//

type topRatedBooksType = {
    averageRating : number; 
    book_cover_image? : string;
    description : string;
    book_title : string;
    id : string
}

export function TopRated() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [topRatedBooks , setTopRatedBooks] = useState<topRatedBooksType[]>([])
  const [totalBooks , setTotalBooks] = useState<number>(0) 
  const [isLoading ,  setIsLoading] = useState<boolean>(false)
  const [startIndex , setStartIndex] = useState<number>(0)
  const authContext = useContext(UserContext)
  const navigation = useNavigate() 
  useEffect(()=>{
    if(!authContext?.loggedIn) navigation('/login')	 
    getTopRated(startIndex , 10, setIsLoading )
    .then(resolve => {
	setTopRatedBooks(resolve?.data?.data)
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
  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="pt-[53px] flex">
        <Sidebar isOpen={sidebarOpen} selectValue="topRated" onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-56">

          <div className="p-4 w-7xl">
            <section>
              <div className="border border-gray-300 rounded">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                  <div className="text-gray-900 font-medium">
		    Top Rated Books
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-900">Book</th>
                        <th className="px-4 py-2 text-left text-gray-900">Description</th>
                        <th className="px-4 py-2 text-left text-gray-900">Rating</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-300">
                      {(!isLoading) ? topRatedBooks.map((book) => (
                        <tr key={book.id} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-14 bg-gray-200 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={(!book.book_cover_image || book.book_cover_image.trim() === '') ? 'default Image' : book.book_cover_image}
                                  alt={book.book_title}
                                  className="w-full h-full object-cover cursor-pointer"
				  onClick={()=>{navigation(`/bookReview/${book.id}`)}}
                                />
                              </div>
                              <span className="text-gray-900">{book.book_title}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-gray-700">{book.description}</td>
                          <td className="px-4 py-3 text-gray-700">{book.averageRating}</td>

                        </tr>
                      )) : 
			   <tr className="w-full">
			      <td colSpan={3} className=" flex flex-row justify-start ">
				<TailSpin color="blue"/>
			      </td>
			  </tr>
		      }
                    </tbody>
                  </table>
		   <div className="w-full border-t flex flex-row justify-start gap-2 text-xl items-center">
		    Page no: 
		   {new Array(Math.ceil(totalBooks/10)).fill(0).map((item , index)=>{
			return (
			    <div key={index} className={(isLoading) ? "text-blue-950 cursor-not-allowed p-4 flex flex-row justify-center items-center" : "text-blue-950 cursor-pointer p-4 flex flex-row justify-center items-center"}
			    style={((startIndex / 10) === index)?{backgroundColor : 'blue' , color : 'white'} : {}}
			    onClick={()=>{changeStartIndex(index)}}
			    >
				{index+1}
			    </div>
			)
		   })
		   }
		    

		   </div> 
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

