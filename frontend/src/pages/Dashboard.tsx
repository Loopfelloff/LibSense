// import { useState } from 'react';
// import  Navbar  from '../components/Dashboard-Components/Navbar';
// import { BookCard } from '../components/Dashboard-Components/BookCard';
// import  Sidebar  from '../components/Dashboard-Components/SideBar';
// import { BookOpen, TrendingUp } from 'lucide-react';

// // Mock data for books
// const interestedBooks = [
//   {
//     id: 1,
//     title: 'The Midnight Library',
//     author: 'Matt Haig',
//     cover: 'https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmaWN0aW9ufGVufDF8fHx8MTc2Mzk4NTg1NXww&ixlib=rb-4.1.0&q=80&w=1080',
//     progress: 65,
//     rating: 4.5,
//     genre: 'Fiction'
//   },
//   {
//     id: 2,
//     title: 'Atomic Habits',
//     author: 'James Clear',
//     cover: 'https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzY0MDQ0NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
//     progress: 42,
//     rating: 4.8,
//     genre: 'Self-Help'
//   },
//   {
//     id: 3,
//     title: 'Project Hail Mary',
//     author: 'Andy Weir',
//     cover: 'https://images.unsplash.com/photo-1725870475677-7dc91efe9f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2NDAwNDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
//     progress: 88,
//     rating: 4.7,
//     genre: 'Sci-Fi'
//   },
//   {
//     id: 4,
//     title: 'The Silent Patient',
//     author: 'Alex Michaelides',
//     cover: 'https://images.unsplash.com/photo-1758803184789-a5dd872fe82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rJTIwY292ZXJ8ZW58MXx8fHwxNzYzOTY5NjMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
//     progress: 15,
//     rating: 4.3,
//     genre: 'Thriller'
//   }
// ];

// const recommendedBooks = [
//   {
//     id: 5,
//     title: 'Where the Crawdads Sing',
//     author: 'Delia Owens',
//     cover: 'https://images.unsplash.com/photo-1628012230086-f6ca7d84a2bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3ZlbCUyMGJvb2slMjByZWFkaW5nfGVufDF8fHx8MTc2Mzk3Mzk1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
//     rating: 4.6,
//     genre: 'Fiction',
//     match: 92
//   },
//   {
//     id: 6,
//     title: 'The Seven Husbands of Evelyn Hugo',
//     author: 'Taylor Jenkins Reid',
//     cover: 'https://images.unsplash.com/photo-1718975592728-7b594fb035b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2V0cnklMjBib29rfGVufDF8fHx8MTc2NDA1NTk0OXww&ixlib=rb-4.1.0&q=80&w=1080',
//     rating: 4.9,
//     genre: 'Historical Fiction',
//     match: 88
//   },
//   {
//     id: 7,
//     title: 'Educated',
//     author: 'Tara Westover',
//     cover: 'https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmaWN0aW9ufGVufDF8fHx8MTc2Mzk4NTg1NXww&ixlib=rb-4.1.0&q=80&w=1080',
//     rating: 4.7,
//     genre: 'Memoir',
//     match: 85
//   },
//   {
//     id: 8,
//     title: 'The Song of Achilles',
//     author: 'Madeline Miller',
//     cover: 'https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzY0MDQ0NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
//     rating: 4.8,
//     genre: 'Fantasy',
//     match: 90
//   },
//   {
//     id: 9,
//     title: 'Thinking, Fast and Slow',
//     author: 'Daniel Kahneman',
//     cover: 'https://images.unsplash.com/photo-1725870475677-7dc91efe9f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2NDAwNDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
//     rating: 4.5,
//     genre: 'Psychology',
//     match: 82
//   }
// ];

// export function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

//       <div className="flex">
//         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//         <main className="flex-1 lg:ml-56">
//           {/* Page Header */}
//           <div className="bg-gray-50 border-b border-gray-300 px-4 py-4">
//             <h1 className="text-gray-900">Dashboard</h1>
//             <div className="text-gray-600">Welcome, John Doe</div>
//           </div>

//           <div className="p-4 max-w-7xl">
//             {/* Recommended Books Section */}
//             <section>
//               <div className="border border-gray-300">
//                 {/* Section Header */}
//                 <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
//                   <div className="text-gray-900">Recommended Books</div>
//                   <a href="#" className="text-blue-600 hover:underline">
//                     View All
//                   </a>
//                 </div>

//                 {/* Books Table */}
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-100 border-b border-gray-300">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-gray-900">Book</th>
//                         <th className="px-4 py-2 text-left text-gray-900">Author</th>
//                         <th className="px-4 py-2 text-left text-gray-900">Genre</th>
//                         <th className="px-4 py-2 text-left text-gray-900">Rating</th>
//                         <th className="px-4 py-2 text-left text-gray-900">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-300">
//                       {recommendedBooks.map((book) => (
//                         <tr key={book.id} className="bg-white hover:bg-gray-50">
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-2">
//                               <div className="w-10 h-14 bg-gray-200 flex-shrink-0">
//                                 <img
//                                   src={book.cover}
//                                   alt={book.title}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <span className="text-gray-900">{book.title}</span>
//                             </div>
//                           </td>
//                           <td className="px-4 py-3 text-gray-700">{book.author}</td>
//                           <td className="px-4 py-3 text-gray-700">{book.genre}</td>
//                           <td className="px-4 py-3 text-gray-700">{book.rating}</td>
//                           <td className="px-4 py-3">
//                             <button className="px-3 py-1 border border-gray-700 text-gray-700 hover:bg-gray-100">
//                               Add
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import { useContext, useState } from "react";
import Navbar from "../components/Dashboard-Components/Navbar";
import Sidebar from "../components/Dashboard-Components/Sidebar";
import { UserContext } from "../context/UserContext";

// Mock data for books
const interestedBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    cover:
      "https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmaWN0aW9ufGVufDF8fHx8MTc2Mzk4NTg1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    progress: 65,
    rating: 4.5,
    genre: "Fiction",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    cover:
      "https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzY0MDQ0NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    progress: 42,
    rating: 4.8,
    genre: "Self-Help",
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover:
      "https://images.unsplash.com/photo-1725870475677-7dc91efe9f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2NDAwNDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    progress: 88,
    rating: 4.7,
    genre: "Sci-Fi",
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover:
      "https://images.unsplash.com/photo-1758803184789-a5dd872fe82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rJTIwY292ZXJ8ZW58MXx8fHwxNzYzOTY5NjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    progress: 15,
    rating: 4.3,
    genre: "Thriller",
  },
];

const recommendedBooks = [
  {
    id: 5,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    cover:
      "https://images.unsplash.com/photo-1628012230086-f6ca7d84a2bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3ZlbCUyMGJvb2slMjByZWFkaW5nfGVufDF8fHx8MTc2Mzk3Mzk1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    genre: "Fiction",
    match: 92,
  },
  {
    id: 6,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    cover:
      "https://images.unsplash.com/photo-1718975592728-7b594fb035b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2V0cnklMjBib29rfGVufDF8fHx8MTc2NDA1NTk0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    genre: "Historical Fiction",
    match: 88,
  },
  {
    id: 7,
    title: "Educated",
    author: "Tara Westover",
    cover:
      "https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmaWN0aW9ufGVufDF8fHx8MTc2Mzk4NTg1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    genre: "Memoir",
    match: 85,
  },
  {
    id: 8,
    title: "The Song of Achilles",
    author: "Madeline Miller",
    cover:
      "https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzY0MDQ0NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    genre: "Fantasy",
    match: 90,
  },
  {
    id: 9,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover:
      "https://images.unsplash.com/photo-1725870475677-7dc91efe9f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2NDAwNDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    genre: "Psychology",
    match: 82,
  },
];

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useContext(UserContext);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="pt-13.25 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-56">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-4">
            <h1 className="text-gray-900 mt-2 text-lg font-semibold">
              Dashboard
            </h1>
            <div className="text-gray-600">
              Welcome, {user?.firstName} {user?.lastName}
            </div>
          </div>

          <div className="p-4 max-w-7xl">
            <section>
              <div className="border border-gray-300 rounded">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                  <div className="text-gray-900 font-medium">
                    Recommended Books
                  </div>
                  <a href="#" className="text-blue-600 hover:underline">
                    View All
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Book
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Author
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Genre
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Rating
                        </th>
                        <th className="px-4 py-2 text-left text-gray-900">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-300">
                      {recommendedBooks.map((book) => (
                        <tr key={book.id} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-14 bg-gray-200 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={book.cover}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-gray-900">
                                {book.title}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {book.author}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {book.genre}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {book.rating}
                          </td>

                          <td className="px-4 py-3">
                            <button className="px-3 py-1 border border-gray-700 text-gray-700 hover:bg-gray-100">
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
