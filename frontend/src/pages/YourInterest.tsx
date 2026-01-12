import { useState , useEffect, useContext, useRef} from 'react';
import { useNavigate} from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Search, X, Plus } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { getGenreByName } from '../apis/getInterestByName.js';
import { addInterest } from '../apis/addInterest.js';
import { getUserPreference } from '../apis/getUserPreference.js';
import { deleteInterest } from '../apis/removeInterest.js';
import type {searchGenre , addGenre , userPreferredGenre} from '../types/userInterest.js'
export function YourInterest() {
  const timerId = useRef<number | null>(null) 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<searchGenre[]>([]);
  const [userGenres, setUserGenres] = useState<userPreferredGenre[]>([]);
  const [isAddingGenre , setIsAddingGenre]= useState<boolean>(false)
  const [isDeletingGenre , setIsDeletingGenre] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const authContext = useContext(UserContext);
  const navigation = useNavigate();


  useEffect(() => {
    if (!authContext?.loggedIn) navigation('/login');
    
    getUserPreference(setIsLoading)
    .then((response : userPreferredGenre[] )=> {
	setUserGenres([...userGenres , ...response])	
	console.log(response)
    })
    .catch(err =>{
	console.log(err.stack)
	alert(err.name)
    })

  }, []);

  const handleInputChange =(e : ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
    }
    if(timerId.current) {
	clearTimeout(timerId.current)
	timerId.current = null
    } 
    timerId.current = setTimeout(async ()=>{
	await handleSearch(e.target.value.trim())
    } , 1000)

  };
  const handleSearch = async (searchQuery : string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try{ 
    const genreData = await getGenreByName(searchQuery , setIsSearching)  
    setSearchResults(genreData);
    }
    catch(err : unknown){
	if(err instanceof Error){
	    alert(err.name)
	}
    }
  };

  const handleAddGenre = async (genre  : searchGenre) => { 
    if(isAddingGenre) return
    try {
	const response = await addInterest(genre.id , setIsAddingGenre) as addGenre
	const newUserGenre = {
	    id : response.id,
	    user_id : response.user_id,
	    genre_id : response.genre_id,
	    genre : {
		id : response.genre_id,
		genre_name : genre.genre_name
	    }
	}
	setUserGenres([...userGenres, newUserGenre]);
	setSearchResults(searchResults.filter(g => g.id !== genre.id));
	setSearchQuery('');
    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log(err.stack)
	    alert(err.name)
	}
    }

  };

  const handleDeleteGenre = async (userGenreId : string) => {
    try {
	const response = await deleteInterest(userGenreId,  setIsDeletingGenre)
	console.log(response)	
	setUserGenres(userGenres.filter(ug => ug.id !== userGenreId));
    }
    catch(err : unknown){
	if(err instanceof Error){
	    alert(err.name)
	}
    }
  };


  return (
    <div className="min-h-screen w-full bg-gray-50">
      
      <div className="flex">
        
        <div className="flex-1 p-6 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your interests
              </h1>
              <p className="text-gray-600 mb-6">
                Maintain your list of interests to get better recommendations
              </p>

              {/* Search Section */}
              <div className="mb-8">
                <form className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      placeholder="Search for genres..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-sm font-medium text-gray-700">
                        Search Results ({searchResults.length})
                      </p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((genre) => (
                        <div
                          key={genre.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-800 capitalize">
                            {genre.genre_name}
                          </span>
                          <button
                            onClick={() => handleAddGenre(genre)}
                            className={(!isAddingGenre) ? "flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm":"flex items-center gap-1 px-3 py-1.5 bg-gray-300 text-white rounded-md cursor-not-allowed transition-colors text-sm"}
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isSearching && (
                  <div className="mt-4 text-center text-gray-500">
                    Searching...
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="mt-4 text-center text-gray-500">
                    No genres found matching "{searchQuery}"
                  </div>
                )}
              </div>

              {/* User's Genres */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Selected Genres
                </h2>
                
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading your genres...
                  </div>
                ) : userGenres.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="mb-2">No genres added yet</p>
                    <p className="text-sm">Search and add genres above to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userGenres.map((userGenre) =>(
                      <div
                        key={userGenre.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <span className="text-gray-800 font-medium capitalize w-full flex flex-row justify-center">
                          {userGenre.genre.genre_name}
                        </span>
                        <button
                          onClick={() => handleDeleteGenre(userGenre.id)}
                          className={(!isDeletingGenre) ? "p-1.5 hover:bg-red-100 rounded-full transition-colors group" : "p-1.5 bg-gray-300 cursor-not-allowed rounded-full transition-colors group" }
                          title="Remove genre"
                        >
                          <X className="w-5 h-5 text-gray-500 group-hover:text-red-600 " />
                        </button>
                      </div>
		    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

