import type { Request, Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'
import { json } from 'node:stream/consumers'

interface AddAuthor {
    author_first_name: string
    author_middle_name?: string | null
    author_last_name: string
}

export const addAuthor = async (req: Request<{}, {}, AddAuthor>, res: Response) => {

    try {
        const { author_first_name, author_middle_name, author_last_name } = req.body

        if (!author_first_name || !author_last_name) {
            return res.status(400).json({ success: false, msg: 'First name and last name are required' })
        }

        const newAuthor = await prisma.bookAuthor.create({
            data: {
                author_first_name: author_first_name.trim(),
                author_middle_name: author_middle_name?.trim() ?? null,
                author_last_name: author_last_name.trim(),

            },
        })

        return res.status(201).json({ success: true, msg: 'Author added successfully', newAuthor })

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