import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'


interface UpdateAuthorBody {
    author_id: string
    author_first_name?: string
    author_middle_name?: string | null
    author_last_name?: string
}


export const updateAuthor = async (
    req: Request<{}, {}, UpdateAuthorBody>,
    res: Response
) => {
    try {
        const { author_id, author_first_name, author_middle_name, author_last_name } = req.body

        const existingAuthor = await prisma.book_author.findUnique({
            where: { id: author_id },
        })

        if (!existingAuthor) {
            return res.status(404).json({ success: false, msg: "Author not found" })
        }

        const updatedAuthor = await prisma.book_author.update({
            where: { id: author_id },
            data: {
                author_first_name: author_first_name?.trim() ?? existingAuthor.author_first_name,
                author_middle_name:
                    author_middle_name !== undefined ? author_middle_name?.trim() ?? null : existingAuthor.author_middle_name,
                author_last_name: author_last_name?.trim() ?? existingAuthor.author_last_name,
            },
        })

        return res.status(200).json({ success: true, msg: "Author updated successfully", updatedAuthor })
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
