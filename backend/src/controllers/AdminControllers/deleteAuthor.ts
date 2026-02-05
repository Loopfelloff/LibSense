import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'

export const deleteAuthor = async (req: Request<{ author_id: string }>, res: Response) => {
    try {
        const { author_id } = req.params

        const author = await prisma.book_author.findUnique({  // Changed from bookAuthor to book_author
            where: { id: author_id },
        })

        if (!author) {
            return res.status(404).json({ success: false, msg: "Author not found" })
        }

        await prisma.book_author.delete({  // Changed from bookAuthor to book_author
            where: { id: author_id },
        })

        return res.status(200).json({
            success: true,
            msg: "Author deleted successfully",
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