

import { Search, Bell, Settings, User, Menu } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden p-1">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-gray-900 font-semibold">libsense</div>
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
            <button className="text-gray-700">
              <Settings className="w-5 h-5" />
            </button>

            <button className="relative text-gray-700">
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 text-gray-700"
              >
                <User className="w-5 h-5" />
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
                      <div className="text-gray-900 font-medium">John Doe</div>
                      <div className="text-gray-600 text-sm">Student</div>
                    </div>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                      My Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                      Settings
                    </button>
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
    </nav>
  );
}

export default Navbar;

