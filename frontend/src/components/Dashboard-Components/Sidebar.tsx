import {
  Home,
  Library,
  Heart,
  Star,
  X,
  Users,
  MessageSquare,
  UserStar
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type SelectValue =
  | "dashBoard"
  | "myLibrary"
  | "favorites"
  | "topRated"
  | "community"
  | "chats"
  | "interests";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const routeMap: Record<SelectValue, string> = {
  dashBoard: "/dashboard",
  myLibrary: "/myLibrary",
  favorites: "/favorites",
  topRated: "/topRated",
  community: "/community",
  chats: "/chats",
  interests : "/interests"
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (key: SelectValue) => location.pathname === routeMap[key];

  const menuItems: {
    icon: React.ElementType;
    label: string;
    key: SelectValue;
  }[] = [
    { icon: Home, label: "Dashboard", key: "dashBoard" },
    { icon: Library, label: "My Library", key: "myLibrary" },
    { icon: Heart, label: "Favorites", key: "favorites" },
    { icon: Star, label: "Top Rated", key: "topRated" },
    { icon: Users, label: "Community", key: "community" },
    { icon: MessageSquare, label: "Chats", key: "chats" },
    { icon: UserStar, label: "Your Interests", key : "interests"}
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-13.25 h-[calc(100vh-53px)] w-56 m-2
        bg-white border-r border-gray-300 z-20 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="p-3">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300 lg:hidden">
            <div className="text-gray-900 font-semibold">Libsense</div>
            <button onClick={onClose} className="p-1">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav>
            {menuItems.map((item) => {
              const active = isActive(item.key);

              return (
                <button
                  key={item.key}
                  className={`w-full flex items-center gap-2 px-3 py-2 m-1 rounded text-left transition
                    ${
                      active
                        ? "bg-gray-200 font-medium text-gray-900"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  onClick={() => {
                    navigate(routeMap[item.key]);
                    onClose();
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Stats */}
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
