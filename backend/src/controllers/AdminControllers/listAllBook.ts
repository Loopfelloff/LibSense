import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'

export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const totalBooks = await prisma.book.count()

        const books = await prisma.book.findMany({
            select: {
                id: true,
                book_title: true,
                isbn: true,
                book_cover_image: true,
                description: true,
                BookWrittenBy: {
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
                createdAt: "desc",
            },
            skip: skip,
            take: limit,
        })

        const formattedBooks = books.map((book) => ({
            id: book.id,
            book_title: book.book_title,
            isbn: book.isbn,
            book_cover_image: book.book_cover_image,
            description: book.description,
            authors: book.BookWrittenBy.map((bw) => bw.book_author),
        }))

        const totalPages = Math.ceil(totalBooks / limit)
        const hasMore = page < totalPages

        return res.status(200).json({
            success: true,
            books: formattedBooks,
            pagination: {
                currentPage: page,
                totalPages,
                totalBooks,
                hasMore,
            },
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

        return res.status(500).json({ success: false, errName: "UnknownError" })
    }
}