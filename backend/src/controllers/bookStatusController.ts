import type { Request, Response } from "express";
import { prisma } from "../config/prismaClientConfig.js";
import { Status } from "../../generated/prisma/index.js";

type BookStatus = "read" | "willread" | "reading";

const statusMap: Record<string, Status> = {
  read: Status.READ,
  reading: Status.READING,
  willread: Status.WILLREAD,
};

const getBooksByStatus = async (req: Request, res: Response) => {
  try {
    const { type } = req.query as { type?: BookStatus };
    const userId = req.query;
    // const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";
    if (!type)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "No status type specified",
        },
      });

    const prismaStatus = statusMap[String(type).toLowerCase()];
    const getRecordByStatus = await prisma.book.findMany({
      where: {
        user_statuses: {
          some: {
            user_id: userId,
            status: prismaStatus,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: getRecordByStatus,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      });
    }
  }
};

const editBookByStatus = async (req: Request, res: Response) => {
  try {
    const { type, bookId } = req.query as {
      type?: BookStatus;
      bookId?: string;
    };
    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";
    if (!type || !bookId)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "status type or book not specified",
        },
      });

    const prismaStatus = statusMap[String(type).toLowerCase()];
    if (!prismaStatus)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "Invalid status type",
        },
      });

    const editRecord = await prisma.bookStatusVal.upsert({
      where: {
        book_id_user_id: {
          book_id: bookId,
          user_id: userId,
        },
      },
      update: {
        status: prismaStatus,
      },
      create: {
        user_id: userId,
        book_id: bookId,
        status: prismaStatus,
      },
    });

    return res.status(200).json({
      success: true,
      data: editRecord,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      });
    }
  }
};

const deleteBookByStatus = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.query as { bookId?: string };

    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";

    if (!bookId)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "status type or book not specified",
        },
      });
    await prisma.bookStatusVal.deleteMany({
      where: {
        book_id: bookId,
        user_id: userId,
      },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      });
    }
  }
};

export { getBooksByStatus, editBookByStatus, deleteBookByStatus };
