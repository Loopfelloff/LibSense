import type {Request , Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'

export const addBook = async (req: Request, res: Response) => {
  try {
    const { isbn, book_title, book_cover_image, description, authors } = req.body;

    if (!isbn || !book_title || !authors || !Array.isArray(authors) || authors.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const book = await prisma.book.create({
      data: {
        isbn,
        book_title,
        book_cover_image,
        description,
      },
    });

    for (const author of authors) {
      let authorId: string;

      if (author.author_id) {
        // Use existing author
        authorId = author.author_id;
      } else {
        // Create new author
        const newAuthor = await prisma.bookAuthor.create({
          data: {
            author_first_name: author.first_name,
            author_middle_name: author.middle_name || null,
            author_last_name: author.last_name,
          },
        });
        authorId = newAuthor.id;
      }

      await prisma.bookWrittenBy.create({
        data: {
          book_id: book.id,
          book_author_id: authorId,
        },
      });
    }

    const createdBook = await prisma.book.findUnique({
      where: { id: book.id },
      include: {
        book_written_by: {
          include: {
            book_author: true,
          },
        },
      },
    });

    return res.status(201).json(createdBook);
  } catch (error) {
    console.error("Error adding book:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};