import {
  Home,
  Library,
  Heart,
  Star,
  Users,
  MessageSquare,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Library, label: "My Library", path: "/library" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Star, label: "Top Rated", path: "/top-rated" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: MessageSquare, label: "Chats", path: "/chats" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-13.25 h-[calc(100vh-53px)] w-56 m-2 bg-white border-r border-gray-300 z-10 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="p-3">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300 lg:hidden">
            <div className="text-gray-900 font-semibold">Libsense</div>
            <button onClick={onClose} className="p-1">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <nav>
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={onClose}
                  className={`w-full flex items-center gap-2 px-3 py-2 m-1 text-left rounded
                    ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="px-3 space-y-3">
              <div>
                <div className="text-gray-600 text-sm">Books Added</div>
                <div className="text-gray-900 font-semibold text-lg">48</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
