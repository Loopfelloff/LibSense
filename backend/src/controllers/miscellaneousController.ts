import type { Request, Response } from "express";
import { prisma } from "../config/prismaClientConfig.js";
import { Status } from "../../generated/prisma/index.js";
import { genSalt, hash } from "bcrypt-ts";

const getMutualBooks = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    const { userId } = req.params;
    // const { id } = req.body;
    const id = "403d1a57-d529-45db-a6d6-38f4204e2b8b";

    if (!userId)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "No userid specified",
        },
      });

    const getMutualRecord = await prisma.book.findMany({
      where: {
        AND: [
          {
            user_statuses: {
              some: {
                user_id: userId,
                status: Status.READ,
              },
            },
          },
          {
            user_statuses: {
              some: {
                user_id: id,
                status: Status.READ,
              },
            },
          },
        ],
      },
      // include: {
      //   user_statuses: {
      //     where: {
      //       user_id: {
      //         in: [userId, id],
      //       },
      //     },
      //   },
      // },
    });

    return res.status(200).json({
      success: true,
      data: getMutualRecord,
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

const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };
    const { newPassword } = req.body;
    if (!id)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "No userid specified",
        },
      });

    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);

    const userRecord = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        msg: "Password changed successfully",
      },
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

export { getMutualBooks };
