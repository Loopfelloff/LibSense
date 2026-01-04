import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'

interface AddBookAuthor {
  author_id?: string
  first_name?: string
  middle_name?: string | null
  last_name?: string
}

interface AddBookBody {
  isbn: string
  book_title: string
  book_cover_image: string
  description: string
  authors: AddBookAuthor[]
}

export const addBook = async (
  req: Request<{}, {}, AddBookBody>,
  res: Response
) => {
  try {
    const { isbn, book_title, book_cover_image, description, authors } = req.body

    if (!isbn || !book_title || !authors || !Array.isArray(authors) || authors.length === 0) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const book = await prisma.book.create({
      data: {
        isbn,
        book_title,
        book_cover_image: book_cover_image?.trim() ?? null,
        description: description?.trim() ?? null,
      },
    })

    for (const author of authors) {
      let authorId: string

      if (author.author_id) {

        authorId = author.author_id
      } else {

        if (!author.first_name || !author.last_name) {
          return res
            .status(400)
            .json({ error: "First and last name required for new author" })
        }

        const newAuthor = await prisma.bookAuthor.create({
          data: {
            author_first_name: author.first_name.trim(),
            author_middle_name: author.middle_name?.trim() ?? null,
            author_last_name: author.last_name.trim(),
          },
        })
        authorId = newAuthor.id
      }

      await prisma.bookWrittenBy.create({
        data: {
          book_id: book.id,
          book_author_id: authorId,
        },
      })
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
    })

    return res.status(201).json({ success: true, book: createdBook })
  } catch (error: unknown) {
    console.error("Error adding book:", error)

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        errName: error.name,
        errMsg: error.message,
      })
    }

    return res.status(500).json({ success: false, errName: "UnknownError" })
  }
}
