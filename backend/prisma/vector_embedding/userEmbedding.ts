import { prisma } from "../../src/config/prismaClientConfig.js";
import { removeStopwords, eng, fra } from "stopword";

const WEIGHTS = {
  interests: 1.0,
  favorites: 0.7,
  read_books: 0.5,
  currently_reading: 0.3,
  want_to_read: 0.1,
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

  console.log(JSON.stringify(userTexts, null, 2));
};

const preprocessText = (text: string = ""): string => {
  const removedText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return removeStopwords(removedText.split(" ")).join(" ");
};

const createUserText = (user) => {
  const weightedTexts: { text: string; weight: number }[] = [];
  const id = user.id;

  if (user.user_preferences?.length > 0) {
    const preferredGenres = user.user_preferences
      .map(({ genre }) => genre.genre_name)
      .join(" ");

    weightedTexts.push({
      text: preprocessText(preferredGenres),
      weight: WEIGHTS.interests,
    });
  }

  const readBooks = user.book_status.read
    .map((book) => [book.book_title, book.description].join(" "))
    .join(" ");

  weightedTexts.push({
    text: preprocessText(readBooks),
    weight: WEIGHTS.read_books,
  });

  const willReadBooks = user.book_status.willRead
    .map((book) => [book.book_title, book.description].join(" "))
    .join(" ");

  weightedTexts.push({
    text: preprocessText(willReadBooks),
    weight: WEIGHTS.want_to_read,
  });

  const currentlyReadingBooks = user.book_status.currentlyReading
    .map((book) => [book.book_title, book.description].join(" "))
    .join(" ");

  weightedTexts.push({
    text: preprocessText(currentlyReadingBooks),
    weight: WEIGHTS.currently_reading,
  });

  return {
    id,
    categories: weightedTexts,
  };
};
