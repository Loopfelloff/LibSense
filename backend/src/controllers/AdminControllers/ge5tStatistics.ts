import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'

export const getStatistics = async (req: Request, res: Response) => {
    try {
        const totalBooks = await prisma.book.count()
        const totalAuthors = await prisma.bookAuthor.count()

        return res.status(200).json({
            success: true,
            statistics: {
                totalBooks,
                totalAuthors,
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