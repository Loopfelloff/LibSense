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
  console.log("HI");
  try {
    const userId = "0385fb63-c60e-4e7e-9767-c585f050c164";
    const profileInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        middle_name: true,
        profile_pic_link: true,
        // password: false, // exclude by simply not selecting it
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
    console.error("Error in getProfileController:", err);

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

    return res.status(500).json({
      success: false,
      error: {
        errMsg: "An unknown error occurred",
      },
    });
  }
};

export { getProfileController };
