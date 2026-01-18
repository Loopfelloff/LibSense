import { prisma } from "../../src/config/prismaClientConfig.js";
import axios from "axios";

const createBookText = (book) => {
  const parts = {};
  parts.id = book.id;
  parts.title = book.book_title;
  parts.description = book.description;

  if (book.book_written_by && book.book_written_by?.length > 0) {
    const authorName = book.book_written_by
      .map(({ book_author }) => {
        return [
          book_author.author_first_name,
          book_author.author_middle_name,
          book_author.author_last_name,
        ]
          .filter(Boolean)
          .join(" ");
      })
      .join(" ");
    parts.author = authorName;
  }

  if (book.book_genres?.length > 0) {
    const genres = book.book_genres
      .map(({ genre }) => {
        return [genre.genre_name].join(" ");
      })
      .join(" ");

    parts.genre = genres;
  }
  return parts;
};

export const getAllBooks = async () => {
  const books = await prisma.book.findMany({
    include: {
      book_written_by: {
        include: {
          book_author: true,
        },
      },
      book_genres: {
        include: {
          genre: true,
        },
      },
    },
  });
  const bookTexts = books.map((book) => {
    return createBookText(book);
  });

  let vectorArr = [];

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/embeddbooks",
      bookTexts,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    vectorArr = response.data;
    console.log(JSON.stringify(vectorArr[0], null, 3));
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
  }
  await Promise.all(
    vectorArr.map((book) => insertEmbeddings(book.vector, book.id)),
  );
};

const insertEmbeddings = async (vectorArray: number[], book_id: string) => {
  const vectorString = `[${vectorArray.join(",")}]`;
  try {
    await prisma.$executeRaw`
        INSERT INTO book_vector (id, book_id, embedding)
        VALUES (gen_random_uuid(), ${book_id}, ${vectorString}::vector)
        ON CONFLICT (book_id) 
        DO UPDATE SET embedding = ${vectorString}::vector, created_at = NOW()
      `;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
};
