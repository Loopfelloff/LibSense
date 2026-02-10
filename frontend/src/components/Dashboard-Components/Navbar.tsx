import { Search, Settings, Menu } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import ChangePasswordModal from "../PasswordChangeModal";
import ChangeProfilePicModal from "../ProfilePicChangeModal";
import SearchResults from "../SearchResults";
import { searchBooks, searchSimilarBooks} from "../../apis/searchApi";
import type { SearchResult } from '../../types/searchResultTypes';
import { useDebounce } from "../../hooks/useDebounce";
import { logOut } from "../../apis/profile";

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [similarBooks, setSimilarBooks] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const user = useContext(UserContext)?.contextState;
  const navigate = useNavigate();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = debouncedSearchQuery.trim();
      
      if (trimmedQuery === "") {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const similarResults = await searchSimilarBooks(trimmedQuery);
        const results = await searchBooks(trimmedQuery);
        setSimilarBooks(similarResults);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
  };
  const handleLogOut = async () => {
    const response = await logOut();
    if(response.success) {
      navigate('/login');
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden p-1">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <div
              onClick={() => navigate("/dashboard")}
              className="text-gray-900 cursor-pointer font-semibold"
            >
              Libsense
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-400"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
              {showSearchResults && (
                <SearchResults
                  semanticResults={similarBooks}
                  genreResults={searchResults}
                  onClose={closeSearchResults}
                />
              )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="text-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
              {showSettingsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 z-50">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-900"
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setShowProfilePicModal(true);
                      }}
                    >
                      Change Profile Picture
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 border-t border-gray-300 hover:bg-gray-100 text-gray-900"
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setShowPasswordModal(true);
                      }}
                    >
                      Change Password
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 text-gray-700"
              >
                <div className="w-12 h-12 shrink-0">
                  {user?.profilePicLink ? (
                    <img
                      src={user.profilePicLink}
                      alt={`${user.firstName}`}
                      className="w-full h-full rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {user?.firstName[0]}
                    </div>
                  )}
                </div>
                <span className="hidden md:inline">Profile</span>
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 z-50">
                    <div className="px-3 py-2 border-b border-gray-300">
                      <div className="text-gray-900 font-medium">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-gray-600 text-sm">Student</div>
                    </div>
                    <Link
                      className="w-full block px-3 py-2 text-left hover:bg-gray-100"
                      to={`/profile/${user?.id}`}
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={() => handleLogOut()}
                      className="w-full text-left px-3 py-2 border-t border-gray-300 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <ChangeProfilePicModal
        isOpen={showProfilePicModal}
        onClose={() => setShowProfilePicModal(false)}
        currentPic={user?.profilePicLink}
      />
    </nav>
  );
}

export default Navbar;
