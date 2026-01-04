import type {Request , Response } from 'express'
import { prisma } from '../../config/prismaClientConfig.js'


export const deleteBook = async (req: Request<{ book_id: string }>, res: Response) => {
  try {
    const { book_id } = req.params

    const book = await prisma.book.findUnique({
      where: { id: book_id },
    })

    if (!book) {
      return res.status(404).json({ success: false, msg: "Book not found" })
    }

    await prisma.book.delete({
      where: { id: book_id },
    })

    return res.status(200).json({
      success: true,
      msg: "Book deleted successfully",
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
