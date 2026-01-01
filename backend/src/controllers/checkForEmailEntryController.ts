import { redisClient } from "../config/redisConfiguration.js";
import type { Request, Response } from "express";
import { prisma } from "../config/prismaClientConfig.js";

const checkForEmailEntryHandler = async (req: Request, res: Response) => {
  try {
    const email: string = String(req.query?.email);

    if (!email)
      return res.status(400).json({
        success: false,
        errDetails: {
          errMsg: "missing email in the request header",
        },
      });

    const redisData = await redisClient.hGetAll(email);

    if (Object.keys(redisData).length !== 0)
      return res.status(409).json({
        success: false,
        errDetails: {
          errMsg:
            "the email is pending for verification check your mail or wait till the otp expires",
        },
      });

    const userData = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    console.log(userData);

    if (userData)
      return res.status(409).json({
        success: false,
        errDetails: {
          errMsg: "the email is already registered",
        },
      });

    return res.status(200).json({
      success: true,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        success: false,
        errName: err.name,
        errMsg: err.message,
      });
    }
  }
};

export { checkForEmailEntryHandler };
