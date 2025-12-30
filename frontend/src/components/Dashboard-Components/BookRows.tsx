import React from "react";

interface BookRowProps {
  cover: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
}

export function BookRow({ cover, title, author, genre, rating }: BookRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={cover}
            alt={title}
            className="w-10 h-14 rounded object-cover border"
          />
          <span className="text-gray-900">{title}</span>
        </div>
      </td>

      <td className="px-4 py-3 text-gray-700">{author}</td>
      <td className="px-4 py-3 text-gray-700">{genre}</td>
      <td className="px-4 py-3 text-gray-700">{rating}</td>

      <td className="px-4 py-3">
        <button className="px-3 py-1 border border-gray-700 rounded hover:bg-gray-100">
          Add
        </button>
      </td>
    </tr>
  );
}
