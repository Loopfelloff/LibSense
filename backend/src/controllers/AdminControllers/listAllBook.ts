import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'


export const getAllBooks = async (req: Request, res: Response) => {
    try {

        const books = await prisma.book.findMany({
            select: {
                id: true,
                book_title: true,
                isbn: true,
                book_cover_image: true,
                description: true,
                book_written_by: {
                    select: {
                        book_author: {
                            select: {
                                id: true,
                                author_first_name: true,
                                author_middle_name: true,
                                author_last_name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                book_title: "asc",
            },
        })


        const formattedBooks = books.map((book) => ({
            id: book.id,
            book_title: book.book_title,
            isbn: book.isbn,
            book_cover_image: book.book_cover_image,
            description: book.description,
            authors: book.book_written_by.map((bw) => bw.book_author),
        }))

        return res.status(200).json({ success: true, books: formattedBooks })
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
