import { prisma } from "../config/prismaClientConfig.js";
import { redisClient } from "../config/redisConfiguration.js";
import type { Request, Response } from "express";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  profile_pic_link?: string;
}

const getProfileController = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.user;
    const userId = "277714";
    const profileInfo = await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    });

    if (!profileInfo) {
      return res.status(400).json({
        success: false,
        error: {
          errMsg: "User not found",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...profileInfo,
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

export { getProfileController };
