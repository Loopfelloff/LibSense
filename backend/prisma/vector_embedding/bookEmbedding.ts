import { prisma } from "../../src/config/prismaClientConfig.js";
import axios from "axios";

const createBookText = (book) => {
  let textParts = [];
  textParts.push(book.book_title);
  textParts.push(book.description);

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
    textParts.push(authorName);
  }

  if (book.book_genres?.length > 0) {
    const genres = book.book_genres
      .map(({ genre }) => {
        return [genre.genre_name].join(" ");
      })
      .join(" ");

    textParts.push(genres);
  }
  return {
    id: book.id,
    text: textParts.join(" ").toLowerCase(),
  };
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

  console.log(JSON.stringify(bookTexts[0], null, 3));
  console.log(JSON.stringify(bookTexts[1], null, 3));
  // try {
  //   const response = await axios.post(
  //     "http://127.0.0.1:8000/books/embedd/all",
  //     bookTexts,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //
  //   vectorArr = response.data;
  //   console.log(JSON.stringify(vectorArr[0], null, 3));
  //   console.log(JSON.stringify(vectorArr[1], null, 3));
  // } catch (err: unknown) {
  //   if (err instanceof Error) console.log(err.message);
  // }
  // await Promise.all(
  //   vectorArr.map((book) => insertEmbeddings(book.vector, book.id)),
  // );
};

export const getBooks = async (bookId: string) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
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
  const bookTexts = createBookText(book);

  let vectorObj = {};

  console.log("hi");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/books/embedd",
      bookTexts,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    vectorObj = response.data;
    console.log(JSON.stringify(vectorObj, null, 3));
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
  }
  await insertEmbeddings(vectorObj.vector, vectorObj.id);
  // await Promise.all(
  //   vectorArr.map((book) => insertEmbeddings(book.vector, book.id)),
  // );
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
