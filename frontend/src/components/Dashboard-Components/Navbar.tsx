import { Search, Settings, Menu } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import ChangePasswordModal from "../PasswordChangeModal";
import ChangeProfilePicModal from "../ProfilePicChangeModal";

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const user = useContext(UserContext)?.contextState;
  console.log(user);
  const navigate = useNavigate();

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
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-400"
              />
            </div>
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
                      alt={`${user.firstName[0]}`}
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
                      className="w-full block px-3 py-2 text-left hover:bg-gray"
                      to={`/profile/${user?.id}`}
                    >
                      My Profile
                    </Link>
                    <button className="w-full text-left px-3 py-2 border-t border-gray-300 hover:bg-gray-100">
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
