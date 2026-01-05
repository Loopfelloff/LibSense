import {
  Home,
  Library,
  Heart,
  Star,
  X,
  Users,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type SelectValue =
  | "dashBoard"
  | "myLibrary"
  | "favorites"
  | "topRated"
  | "community"
  | "chats";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectValue: SelectValue;
}

function Sidebar({ isOpen, onClose, selectValue }: SidebarProps) {
  const returnTheActiveLabel: (activeTab: SelectValue) => boolean = (
    activeTab: SelectValue,
  ) => {
    return selectValue === activeTab;
  };
  const navigation = useNavigate();
  const sideBarElement: string[] = [
    "dashBoard",
    "myLibrary",
    "favorites",
    "topRated",
    "community",
    "chats",
  ];
  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      active: returnTheActiveLabel("dashBoard"),
    },
    {
      icon: Library,
      label: "My Library",
      active: returnTheActiveLabel("myLibrary"),
    },
    {
      icon: Heart,
      label: "Favorites",
      active: returnTheActiveLabel("favorites"),
    },
    {
      icon: Star,
      label: "Top Rated",
      active: returnTheActiveLabel("topRated"),
    },
    {
      icon: Users,
      label: "Community",
      active: returnTheActiveLabel("community"),
    },
    {
      icon: MessageSquare,
      label: "Chats",
      active: returnTheActiveLabel("chats"),
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-13.25 h-[calc(100vh-53px)] w-56 m-2 bg-white border-r border-gray-300 z-10 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300 lg:hidden">
            <div className="text-gray-900 font-semibold">Libsense</div>
            <button onClick={onClose} className="p-1">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <nav>
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-2 px-3 py-2 m-1 text-left rounded
                  ${item.active ? "bg-gray-200" : "hover:bg-gray-100"}`}
                onClick={() => {
                  navigation(`/${sideBarElement[index]}`);
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
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
