import type { Request, Response } from "express"
import { prisma } from "../../config/prismaClientConfig.js"
import { uploadToCloudinary } from "../../config/cloudinaryConfig.js"
import axios from "axios"

interface UpdateBookBody {
  book_id: string
  book_title?: string
  isbn?: string
  description?: string
}

// Helper function to create book text for embedding
const createBookText = (book: any) => {
  const parts: string[] = []
  
  // Add title
  if (book.book_title) {
    parts.push(book.book_title)
  }
  
  // Add description
  if (book.description) {
    parts.push(book.description)
  }

  // Add author names
  if (book.BookWrittenBy && book.BookWrittenBy?.length > 0) {  // Changed from book_written_by to BookWrittenBy
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

  // Add genres
  if (book.BookGenres?.length > 0) {  // Changed from book_genres to BookGenres
    const genres = book.BookGenres
      .map(({ genre }: any) => genre.genre_name)
      .join(" ")
    parts.push(genres)
  }

  // Combine all parts into a single text string
  return parts.filter(Boolean).join(" ")
}

// Helper function to update embeddings
const updateEmbeddings = async (vectorArray: number[], book_id: string) => {
  const vectorString = `[${vectorArray.join(",")}]`
  try {
    await prisma.$executeRaw`
      INSERT INTO book_vector (id, book_id, embedding)
      VALUES (gen_random_uuid(), ${book_id}, ${vectorString}::vector)
      ON CONFLICT (book_id) 
      DO UPDATE SET embedding = ${vectorString}::vector, created_at = NOW()
    `
    console.log(`✅ Vector updated for book: ${book_id}`)
  } catch (error) {
    console.error("Error updating embeddings:", error)
    throw error
  }
}

export const updateBook = async (
  req: Request<{}, {}, UpdateBookBody>,
  res: Response
) => {
  try {
    const { book_id, book_title, isbn, description } = req.body

    const existingBook = await prisma.book.findUnique({
      where: { id: book_id },
    })

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        msg: "Book not found",
      })
    }

    let coverUrl = existingBook.book_cover_image

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

    const updatedBook = await prisma.book.update({
      where: { id: book_id },
      data: {
        book_title: book_title?.trim() ?? existingBook.book_title,
        isbn: isbn?.trim() ?? existingBook.isbn,
        description: description?.trim() ?? existingBook.description,
        book_cover_image: coverUrl,
      },
      include: {
        book_written_by: {  // Correct - PascalCase
          include: { book_author: true },
        },
        book_genres: {  // Changed from book_genres to BookGenres
          include: { genre: true },
        },
      },
    })

    // Check if any content that affects the vector was updated
    const contentUpdated = 
      book_title !== undefined || 
      description !== undefined

    // Update embeddings if book content changed
    if (contentUpdated) {
      try {
        const bookText = createBookText(updatedBook)
        
        // Create the payload matching your Word2Vec API's Book model
        const embeddingPayload = {
          id: book_id,
          text: bookText
        }
        
        const embeddingResponse = await axios.post(
          "http://127.0.0.1:8000/books/embedd",
          embeddingPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000
          }
        )

        const { vector } = embeddingResponse.data
        
        if (vector && Array.isArray(vector)) {
          await updateEmbeddings(vector, book_id)
          console.log(`✅ Successfully updated embedding for book: ${book_id} after content change`)
        }
      } catch (embeddingError) {
        // Log error but don't fail the book update
        console.error('⚠️ Error updating embedding after book update:', embeddingError)
      }
    }

    return res.status(200).json({
      success: true,
      msg: "Book updated successfully",
      updatedBook,
    })
  } catch (error: unknown) {
    console.error(error)

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
