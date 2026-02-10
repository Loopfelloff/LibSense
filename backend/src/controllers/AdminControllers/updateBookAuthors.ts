import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'
import axios from 'axios'

interface BookAuthorInput {
    author_id?: string
    first_name?: string
    middle_name?: string | null
    last_name?: string
}

interface UpdateBookAuthorsBody {
    book_id: string
    authors: BookAuthorInput[]
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

// Helper function to update embeddings (uses ON CONFLICT to update, not insert new)
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

export const updateBookAuthors = async (
    req: Request<{}, {}, UpdateBookAuthorsBody>,
    res: Response
) => {
    try {
        const { book_id, authors } = req.body

        if (!book_id || !Array.isArray(authors) || authors.length === 0) {
            return res.status(400).json({ 
                success: false, 
                errMsg: "Book ID and authors array are required. At least one author must be provided." 
            })
        }

        // Verify book exists
        const existingBook = await prisma.book.findUnique({ 
            where: { id: book_id } 
        })
        
        if (!existingBook) {
            return res.status(404).json({ 
                success: false, 
                errMsg: "Book not found" 
            })
        }

        // Step 1: Remove all existing author relationships for this book
        await prisma.bookWrittenBy.deleteMany({
            where: { book_id }
        })

        // Step 2: Process and add new/existing authors
        const authorIds: string[] = []

        for (const author of authors) {
            let authorId: string

            if (author.author_id) {
                // Use existing author
                authorId = author.author_id
                
                // Verify author exists
                const existingAuthor = await prisma.book_author.findUnique({
                    where: { id: authorId }
                })
                
                if (!existingAuthor) {
                    return res.status(404).json({ 
                        success: false, 
                        errMsg: `Author with ID ${authorId} not found` 
                    })
                }
            } else {
                // Create new author
                if (!author.first_name?.trim() || !author.last_name?.trim()) {
                    return res.status(400).json({ 
                        success: false, 
                        errMsg: "New authors require both first name and last name" 
                    })
                }

                const newAuthor = await prisma.book_author.create({
                    data: {
                        author_first_name: author.first_name.trim(),
                        author_middle_name: author.middle_name?.trim() || null,
                        author_last_name: author.last_name.trim(),
                    },
                })
                authorId = newAuthor.id
            }

            authorIds.push(authorId)
        }

        // Step 3: Create new relationships
        await prisma.bookWrittenBy.createMany({
            data: authorIds.map(authorId => ({
                book_author_id: authorId,
                book_id
            })),
            skipDuplicates: true
        })

        // Step 4: Fetch updated book with all relations
        const updatedBook = await prisma.book.findUnique({
            where: { id: book_id },
            include: {
                BookWrittenBy: {
                    include: { book_author: true },
                },
                BookGenres: {
                    include: { genre: true },
                },
            },
        })

        // Step 5: Update embeddings since authors changed
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
                // This will UPDATE the existing vector, not create a new one
                // thanks to the ON CONFLICT clause in the updateEmbeddings function
                await updateEmbeddings(vector, book_id)
                console.log(`✅ Successfully updated embedding for book: ${book_id} after author change`)
            }
        } catch (embeddingError) {
            // Log error but don't fail the author update
            console.error('⚠️ Error updating embedding after author change:', embeddingError)
        }

        return res.status(200).json({
            success: true,
            msg: "Book authors updated successfully",
            book: updatedBook,
        })
    } catch (error: unknown) {
        console.error('Error updating book authors:', error)
        
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
            errMsg: "An unexpected error occurred while updating book authors"
        })
    }
}