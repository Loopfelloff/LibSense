import { Request, Response } from "express"
import { prisma } from "../../config/prismaClientConfig.js"

export const suggestedAuthors = async (req: Request, res: Response) => {
    const { query } = req.query

    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Query parameter is required',
        })
    }

    const words = query.trim().split(/\s+/);

    try {
        const authors = await prisma.bookAuthor.findMany({
            where: {
                AND: words.map((word) => ({
                    OR: [
                        { author_first_name: { contains: word, mode: 'insensitive' } },
                        { author_last_name: { contains: word, mode: 'insensitive' } },
                    ],
                })),
            },
            select: {
                id: true,
                author_first_name: true,
                author_last_name: true,
                book_written_by: {
                    take: 2,
                    orderBy: {
                        book: { id: 'desc' },
                    },
                    select: {
                        book: {
                            select: {
                                book_title: true,
                                book_cover_image: true,
                            },
                        },
                    },
                },
            },
            take: 10,
        })

        const result = authors.map((a) => ({
            id: a.id,
            firstName: a.author_first_name,
            lastName: a.author_last_name,
            recentBooks: a.book_written_by.map(b => ({
                title: b.book.book_title,
                coverImage: b.book.book_cover_image,
            })),
        }))

        return res.status(200).json({
            success: true,
            authors: result,
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
    }
}