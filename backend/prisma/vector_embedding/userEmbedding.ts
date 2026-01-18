import { prisma } from "../../src/config/prismaClientConfig.js";
import axios from "axios";

const preprocessText = (text: string = ""): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const createUserText = (user) => {
  const id = user.id;
  const parts: string[] = [];

  if (user.user_preferences?.length > 0) {
    const preferredGenres = user.user_preferences
      .map(({ genre }) => genre.genre_name)
      .join(", ");

    parts.push(`Preferred genres: ${preferredGenres}.`);
  }

  const readBooks = user.book_status.read
    .slice(0, 10)
    .map(
      (book) => `${book.book_title}. ${book.description?.slice(0, 400) || ""}`,
    )
    .join(" ");

  if (readBooks) {
    parts.push(`Books the user has read: ${readBooks}`);
  }

  const currentlyReadingBooks = user.book_status.currentlyReading
    .slice(0, 5)
    .map(
      (book) => `${book.book_title}. ${book.description?.slice(0, 400) || ""}`,
    )
    .join(" ");

  if (currentlyReadingBooks) {
    parts.push(`Books the user is currently reading: ${currentlyReadingBooks}`);
  }

  const willReadBooks = user.book_status.willRead
    .slice(0, 5)
    .map((book) => book.book_title)
    .join(", ");

  if (willReadBooks) {
    parts.push(`Books the user wants to read: ${willReadBooks}.`);
  }

  const mergedText = preprocessText(parts.join(" "));

  return {
    id,
    text: mergedText,
  };
};
const groupBookStatus = (bookStatusVal = []) => {
  return bookStatusVal.reduce(
    (acc, item) => {
      switch (item.status) {
        case "WILLREAD":
          acc.willRead.push(item.book);
          break;

        case "READING":
          acc.currentlyReading.push(item.book);
          break;

        case "READ":
          acc.read.push(item.book);
          break;
      }
      return acc;
    },
    {
      willRead: [],
      currentlyReading: [],
      read: [],
    },
  );
};

export const getUserProfile = async () => {
  const users = await prisma.user.findMany({
    include: {
      favourites: { include: { book: true } },
      book_status_val: { include: { book: true } },
      user_preferences: { include: { genre: true } },
    },
  });

  const newUsers = users.map((user) => ({
    ...user,
    book_status: groupBookStatus(user.book_status_val),
  }));

  const userTexts = newUsers.map(createUserText);

  let vectorArr;
  console.log("hi");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/embedd/users/all",
      userTexts,
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
    vectorArr.map((user) => insertEmbeddings(user.vector, user.id)),
  );
  console.log(JSON.stringify(userTexts, null, 2));
};

const insertEmbeddings = async (vectorArray: number[], user_id: string) => {
  const vectorString = `[${vectorArray.join(",")}]`;
  try {
    await prisma.$executeRaw`
        INSERT INTO user_vector (id, user_id, embedding)
        VALUES (gen_random_uuid(), ${user_id}, ${vectorString}::vector)
        ON CONFLICT (user_id) 
        DO UPDATE SET embedding = ${vectorString}::vector, created_at = NOW()
      `;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
};
