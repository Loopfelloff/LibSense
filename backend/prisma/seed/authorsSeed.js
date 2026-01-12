import { prisma } from "../../src/config/prismaClientConfig.js";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function main() {
  const filePath = path.join(__dirname, "./books_clean.json");

  const payloads = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`📦 Inserting ${payloads.length} authors into the database...`);

  for (const payload of payloads) {
    await prisma.book.create({
      data: {
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

  console.log("✅ Book authors inserted successfully!");
}
