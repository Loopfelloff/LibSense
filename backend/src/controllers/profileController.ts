import { prisma } from "../config/prismaClientConfig.js"
import { redisClient } from "../config/redisConfiguration.js"
import type { Request, Response } from "express"

const getProfileController = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID is required" })
  }
  try {
    const cachedProfileInfo = await redisClient.get(`user:${userId}:profile`)
    if (cachedProfileInfo) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedProfileInfo),
      })
    }

    const profileInfo = await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    })

    if (!profileInfo) {
      return res.status(400).json({
        success: false,
        error: {
          errMsg: "User not found",
        },
      })
    }

    await redisClient.set(
      `user:${userId}:profile`,
      JSON.stringify(profileInfo),
      {
        EX: 60 * 10,
      },
    )

    return res.status(200).json({
      success: true,
      data: profileInfo,
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

export { getProfileController }
