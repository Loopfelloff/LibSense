import type { Request, Response } from "express";
import { prisma } from "../config/prismaClientConfig.js";
import { Status } from "../../generated/prisma/index.js";
import { redisClient } from "../config/redisConfiguration.js";

type BookStatus = "read" | "willread" | "reading"

const statusMap: Record<string, Status> = {
  read: Status.READ,
  reading: Status.READING,
  willread: Status.WILLREAD,
}

const getBooksByStatus = async (req: Request, res: Response) => {
  try {
    const { type , userId} = req.query as { type?: BookStatus , userId?:string };
    const id = userId

    if (!type)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "No status type specified",
        },
      })

    const prismaStatus = statusMap[String(type).toLowerCase()]
    const getRecordByStatus = await prisma.book.findMany({
      where: {
        user_statuses: {
          some: {
            user_id: id,
            status: prismaStatus,
          },
        },
      },
    })

    return res.status(200).json({
      success: true,
      data: getRecordByStatus,
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message)
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      })
    }
  }
}

const editBookByStatus = async (req: Request, res: Response) => {
  try {
    const { type, bookId } = req.body as {
      type?: BookStatus;
      bookId?: string;
    };
    const { id } = req.user as { id: string };
    if (!type || !bookId)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "status type or book not specified",
        },
      })

    const prismaStatus = statusMap[String(type).toLowerCase()]
    if (!prismaStatus)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "Invalid status type",
        },
      })

    const editRecord = await prisma.bookStatusVal.upsert({
      where: {
        user_book_status: {
          book_id: bookId,
          user_id: id,
        },
      },
      update: {
        status: prismaStatus,
      },
      create: {
        user_id: id,
        book_id: bookId,
        status: prismaStatus,
      },
    })

    const countKey = `user:${id}:recommendations`;
    await redisClient.del(countKey);
    return res.status(200).json({
      success: true,
      data: editRecord,
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message)
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      })
    }
  }
}

const deleteBookByStatus = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.body as { bookId?: string };

    const { id } = req.user as { id: string };

    if (!bookId)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "status type or book not specified",
        },
      })
    await prisma.bookStatusVal.deleteMany({
      where: {
        book_id: bookId,
        user_id: id,
      },
    });
    const countKey = `user:${id}:recommendations`;
    await redisClient.del(countKey);
    return res.status(200).json({
      success: true,
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message)
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      })
    }
  }
}

export { getBooksByStatus, editBookByStatus, deleteBookByStatus }
