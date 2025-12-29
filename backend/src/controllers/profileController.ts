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
  const userId = "0385fb63-c60e-4e7e-9767-c585f050c164";
  try {
    const cachedProfileInfo = await redisClient.get(`user:${userId}`);
    if (cachedProfileInfo) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedProfileInfo),
      });
    }

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

    await redisClient.set(`user:${userId}`, JSON.stringify(profileInfo), {
      EX: 60 * 10,
    });

    return res.status(200).json({
      success: true,
      data: profileInfo,
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
