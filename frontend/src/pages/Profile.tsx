import { Book as BookIcon, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../apis/profile";
import { getBooksByStatus } from "../apis/bookStatus";
import type { User } from "../types/profile";
import type { Book } from "../types/books";
import { useNavigate, useParams } from "react-router-dom";

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [readingBooks, setReadingBooks] = useState<Book[]>([]);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const { userId } = useParams<{ userId: string }>();
  console.log({ userId });
  const navigation = useNavigate();

  useEffect(() => {
    if (!userId) return;
    const userInformation = async (userId: string) => {
      const [profile, readBooksRes, readingBooksRes] = await Promise.all([
        getUserProfile(userId),
        getBooksByStatus(userId, "read"),
        getBooksByStatus(userId, "reading"),
      ]);

      setUser(profile);
      setReadBooks(readBooksRes);
      setReadingBooks(readingBooksRes);

      console.log(profile, readBooksRes, readingBooksRes);
    };
    userInformation(userId);
  }, [userId]);

  return (
    <div className="min-h-screen w-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white border border-gray-300 p-6 m-6">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 shrink-0">
              {user?.profile_pic_link ? (
                <img
                  src={user.profile_pic_link}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {user?.first_name[0]}
                </div>
              )}
            </div>
            {/* User Info */}
            <div>
              <h1 className="text-gray-900 mb-2">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Currently Reading */}
        <div className="mb-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-700" />
            <h2 className="text-gray-900">Currently Reading</h2>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            {readingBooks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {readingBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex cursor-pointer gap-3 p-3 w-fit border border-gray-300 "
                    onClick={() => {
                      navigation(`/bookReview/${book.id}`);
                    }}
                  >
                    <img
                      src={book.book_cover_image}
                      loading="lazy"
                      alt={book.book_title}
                      className="w-16 h-20 object-cover bg-gray-200"
                    />
                    <span className="">
                      <h3 className="text-gray-900 mb-1">{book.book_title}</h3>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No books currently reading</p>
            )}
          </div>
        </div>

        {/* Read Books */}
        <div className="mb-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <BookIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-gray-900">Read Books ({readBooks.length})</h2>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            {readBooks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {readBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex cursor-pointer gap-3 p-3 w-fit border border-gray-300 "
                    onClick={() => {
                      navigation(`/bookReview/${book.id}`);
                    }}
                  >
                    <img
                      src={book.book_cover_image}
                      alt={book.book_title}
                      className="w-16 h-20 object-cover bg-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{book.book_title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No books read yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
