// import { Home, Library, Heart, Star, X, Users, MessageSquare } from 'lucide-react';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// function Sidebar({ isOpen, onClose }: SidebarProps) {
//   const menuItems = [
//     { icon: Home, label: 'Dashboard', active: true },
//     { icon: Library, label: 'My Library', active: false },
//     { icon: Heart, label: 'Favorites', active: false },
//     { icon: Star, label: 'Top Rated', active: false },
//     { icon: Users, label: 'Community', active: false },
//     { icon: MessageSquare, label: 'Chats', active: false }
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
//           onClick={onClose}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-300 z-50 transition-transform duration-300 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0 lg:top-[53px] lg:h-[calc(100vh-53px)]`}
//       >
//         <div className="p-3">
//           {/* Mobile Header */}
//           <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300 lg:hidden">
//             <div className="text-gray-900">libsense</div>
//             <button onClick={onClose} className="p-1">
//               <X className="w-4 h-4 text-gray-600" />
//             </button>
//           </div>

//           {/* Navigation Menu */}
//           <nav>
//             {menuItems.map((item, index) => (
//               <button
//                 key={index}
//                 className={`w-full flex items-center gap-2 px-3 py-2 mb-1 text-left ${
//                   item.active
//                     ? 'bg-gray-200 text-gray-900'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <item.icon className="w-4 h-4" />
//                 <span>{item.label}</span>
//               </button>
//             ))}
//           </nav>

//           {/* Stats Section */}
//           <div className="mt-4 pt-4 border-t border-gray-300">
//             <div className="px-3 space-y-3">
//               <div>
//                 <div className="text-gray-600">Books Added</div>
//                 <div className="text-gray-900">48</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }



// export default Sidebar



import { Home, Library, Heart, Star, X, Users, MessageSquare } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Library, label: "My Library", active: false },
    { icon: Heart, label: "Favorites", active: false },
    { icon: Star, label: "Top Rated", active: false },
    { icon: Users, label: "Community", active: false },
    { icon: MessageSquare, label: "Chats", active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[53px] h-[calc(100vh-53px)] w-56 bg-white border-r border-gray-300 z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="p-3">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300 lg:hidden">
            <div className="text-gray-900 font-semibold">libsense</div>
            <button onClick={onClose} className="p-1">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <nav>
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-1 text-left rounded
                  ${item.active ? "bg-gray-200" : "hover:bg-gray-100"}`}
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

