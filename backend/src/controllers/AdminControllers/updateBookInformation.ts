import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'


interface UpdateBookBody {
    book_id: string
    book_title?: string
    isbn?: string
    book_cover_image?: string | null
    description?: string
}

export const updateBook = async (req: Request<{}, {}, UpdateBookBody>, res: Response) => {
    try {
        const { book_id, book_title, isbn, book_cover_image, description } = req.body

        const existingBook = await prisma.book.findUnique({
            where: { id: book_id },
        })

        if (!existingBook) {
            return res.status(404).json({ success: false, msg: "Book not found" })
        }

        const updatedBook = await prisma.book.update({
            where: { id: book_id },
            data: {
                book_title: book_title?.trim() ?? existingBook.book_title,
                isbn: isbn?.trim() ?? existingBook.isbn,
                book_cover_image: book_cover_image ?? existingBook.book_cover_image,
                description: description?.trim() ?? existingBook.description,
            },
        })

        return res.status(200).json({ success: true, msg: "Book updated successfully", updatedBook })
    } catch (error: unknown) {
        console.error(error)

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
