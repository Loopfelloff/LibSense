import type { Request, Response } from "express"
import { prisma } from "../../config/prismaClientConfig.js"
import { uploadToCloudinary } from "../../config/cloudinaryConfig.js"

interface UpdateBookBody {
  book_id: string
  book_title?: string
  isbn?: string
  description?: string
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
    })

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
