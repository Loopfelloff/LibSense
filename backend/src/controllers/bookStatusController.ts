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
    const status: BookStatus = "read";

    if (!status)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "No status type specified",
        },
      });

    const prismaStatus = statusMap[String(status).toLowerCase()];
    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";
    const booksByUserStatus = await prisma.book.findMany({
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
      data: booksByUserStatus,
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
