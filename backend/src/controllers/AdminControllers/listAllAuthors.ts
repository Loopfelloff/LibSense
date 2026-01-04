import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'


export const getAllAuthors = async (req: Request, res: Response) => {
    try {

        const authors = await prisma.bookAuthor.findMany({
            select: {
                id: true,
                author_first_name: true,
                author_middle_name: true,
                author_last_name: true,
                book_written_by: {
                    select: {
                        book: {
                            select: {
                                id: true,
                                book_title: true,
                                isbn: true,
                                book_cover_image: true,
                                description: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                author_first_name: "asc",
            },
        })


        const formattedAuthors = authors.map((author) => ({
            id: author.id,
            first_name: author.author_first_name,
            middle_name: author.author_middle_name,
            last_name: author.author_last_name,
            books: author.book_written_by.map((bw) => bw.book),
        }))

        return res.status(200).json({ success: true, authors: formattedAuthors })
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
