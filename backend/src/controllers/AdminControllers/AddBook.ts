import type { Request, Response } from "express"
import { prisma } from "../../config/prismaClientConfig.js"
import { uploadToCloudinary } from "../../config/cloudinaryConfig.js"
import axios from "axios"

interface AddBookAuthor {
  author_id?: string
  first_name?: string
  middle_name?: string | null
  last_name?: string
}

interface AddBookBody {
  isbn: string
  book_title: string
  description?: string
  authors: AddBookAuthor[]
  genres?: string[]
}

// Helper function to insert embeddings
const insertEmbeddings = async (vectorArray: number[], book_id: string) => {
  const vectorString = `[${vectorArray.join(",")}]`
  try {
    await prisma.$executeRaw`
      INSERT INTO book_vector (id, book_id, embedding)
      VALUES (gen_random_uuid(), ${book_id}, ${vectorString}::vector)
      ON CONFLICT (book_id) 
      DO UPDATE SET embedding = ${vectorString}::vector, created_at = NOW()
    `
  } catch (error) {
    console.error("Error inserting embeddings:", error)
    throw error
  }
}

// Helper function to create book text for embedding
const createBookText = (book: any) => {
  const parts: string[] = []
  
  if (book.book_title) {
    parts.push(book.book_title)
  }
  
  if (book.description) {
    parts.push(book.description)
  }

  if (book.BookWrittenBy && book.BookWrittenBy?.length > 0) {
    const authorNames = book.BookWrittenBy
      .map(({ book_author }: any) => {
        return [
          book_author.author_first_name,
          book_author.author_middle_name,
          book_author.author_last_name,
        ]
          .filter(Boolean)
          .join(" ")
      })
      .join(" ")
    parts.push(authorNames)
  }

  if (book.BookGenres?.length > 0) {
    const genres = book.BookGenres
      .map(({ genre }: any) => genre.genre_name)
      .join(" ")
    parts.push(genres)
  }

  return parts.filter(Boolean).join(" ")
}

export const addBook = async (
  req: Request<{}, {}, AddBookBody>,
  res: Response
) => {
  try {
    if (typeof req.body.authors === 'string') {
      req.body.authors = JSON.parse(req.body.authors)
    }

    const { isbn, book_title, description, authors } = req.body

    if (!isbn || !book_title || !Array.isArray(authors) || authors.length === 0) {
      return res.status(400).json({
        success: false,
        error: "ISBN, title and authors are required",
      })
    }

    let coverUrl: string = 'backend/src/resources/coverImageForBook.png'

    if (req.files) {
      const files = req.files as { [field: string]: Express.Multer.File[] }
      const file = files.book_cover_image?.[0]

      if (file) {
        const uploaded = await uploadToCloudinary(file.buffer, {
          folder: "Libsense/books",
          resource_type: "auto",
        })

        coverUrl = uploaded.secure_url
      }
    }

    const book = await prisma.book.create({
      data: {
        isbn: isbn.trim(),
        book_title: book_title.trim(),
        description: description?.trim() ?? "",
        book_cover_image: coverUrl,
      },
    })

    for (const author of authors) {
      let authorId: string

      if (author.author_id) {
        authorId = author.author_id
      } else {
        if (!author.first_name || !author.last_name) {
          return res.status(400).json({
            success: false,
            error: "First & last name required for new author",
          })
        }

        const newAuthor = await prisma.book_author.create({
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
        BookWrittenBy: {
          include: { book_author: true },
        },
        BookGenres: {
          include: { genre: true },
        },
      },
    })

    try {
      const bookText = createBookText(createdBook)
      
      const embeddingPayload = {
        id: book.id,
        text: bookText
      }
      
      const embeddingResponse = await axios.post(
        "http://127.0.0.1:8000/books/embedd",
        embeddingPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const { vector } = embeddingResponse.data
      await insertEmbeddings(vector, book.id)
      
      console.log(`Successfully created embedding for book: ${book.id}`)
    } catch (embeddingError) {
      console.error("Error generating embedding for book:", embeddingError)
    }

    return res.status(201).json({
      success: true,
      book: createdBook,
    })
  } catch (error: any) {
    console.error("Error adding book:", error)

    if (error?.code === 'P2002') {
      let field = 'field'

      if (typeof error?.message === 'string') {
        const match = error.message.match(/\((`?)([^)`]+)\1\)/)
        if (match?.[2]) field = match[2]
      }
      return res.status(400).json({
        success: false,
        errMsg: `A record with this ${field} already exists.`
      })
    }

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        errName: error.name,
        errMsg: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      errName: "UnknownError",
    })
  }
}