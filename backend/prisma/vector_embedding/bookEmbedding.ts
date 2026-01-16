import { prisma } from "../../src/config/prismaClientConfig.js";

const getAllBooks = async () => {
  for (const payload of payloads) {
    await prisma.book.upsert({
      where: {
        isbn: payload.book.isbn, // must be @unique
      },
      update: {}, // do nothing if the book already exists
      create: {
        isbn: payload.book.isbn,
        book_title: payload.book.book_title,
        book_cover_image: payload.book.book_cover_image,
        description: payload.book.description,

        book_written_by: {
          create: payload.authors.map((author) => ({
            book_author: {
              create: {
                author_first_name: author.author_first_name,
                author_middle_name: author.author_middle_name,
                author_last_name: author.author_last_name,
              },
            },
          })),
        },

        book_genres: {
          create: payload.genres.map((genre) => ({
            genre: {
              connectOrCreate: {
                where: { genre_name: genre },
                create: { genre_name: genre },
              },
            },
          })),
        },
      },
    });
  }
};
