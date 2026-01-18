import { prisma } from "../../src/config/prismaClientConfig.js";

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

  console.log(JSON.stringify(userTexts, null, 2));
};

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
