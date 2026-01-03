import { useState , useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Dashboard-Components/Navbar';
import Sidebar from '../components/Dashboard-Components/Sidebar';
import { UserContext } from '../context/UserContext';
import { TailSpin } from 'react-loader-spinner';
// Mock data for books

export function BookReview() {
  const {bookId} = useParams()
  console.log(bookId)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLoading ,  setIsLoading] = useState<boolean>(false)
  const authContext = useContext(UserContext)
  const navigation = useNavigate() 
  useEffect(()=>{
    if(!authContext?.loggedIn) navigation('/login')	 
  } , [])
  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="pt-[53px] flex">
        <Sidebar isOpen={sidebarOpen} selectValue="topRated" onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-56">

          <div className="p-4 w-7xl">
            <section>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

