import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'


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


export const updateBookAuthors = async (
    req: Request<{}, {}, UpdateBookAuthorsBody>,
    res: Response
) => {
    try {
        const { book_id, authors } = req.body

        if (!book_id || !Array.isArray(authors) || authors.length === 0) {
            return res.status(400).json({ success: false, msg: "Book ID and authors array are required" })
        }

        const existingBook = await prisma.book.findUnique({ where: { id: book_id } })
        if (!existingBook) {
            return res.status(404).json({ success: false, msg: "Book not found" })
        }

        for (const author of authors) {
            let authorId: string

            if (author.author_id) {
                authorId = author.author_id
            } else {
                if (!author.first_name || !author.last_name) {
                    return res.status(400).json({ success: false, msg: "New authors require first and last name" })
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

            await prisma.bookWrittenBy.upsert({
                where: {
                    book_author_id_book_id: {
                        book_author_id: authorId,
                        book_id,
                    },
                },
                update: {},
                create: {
                    book_author_id: authorId,
                    book_id,
                },
            })

        }

        const updatedBook = await prisma.book.findUnique({
            where: { id: book_id },
            include: {
                book_written_by: {
                    include: { book_author: true },
                },
            },
        })

        return res.status(200).json({
            success: true,
            msg: "Book authors updated successfully",
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
        return res.status(500).json({ success: false, errName: "UnknownError" })
    }
}
