import type { Request, Response } from "express";
import { redisClient } from "../config/redisConfiguration.js";
import { prisma } from "../config/prismaClientConfig.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const getFavouriteBook = async (req: Request, res: Response) => {
  try {
    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";
    const key = `user:${userId}:favourites`;
    const cachedFavourite = await redisClient.get(key);
    // const limit = 10;
    // let totalPages = Number(await redisClient.get(`user:${userId}:totalPages`));

    if (cachedFavourite) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedFavourite),
      });
    }

    // if (!totalPages) {
    //   const totalFavourites = await prisma.book.count({
    //     where: {
    //       favourites: {
    //         some: {
    //           user_id: userId,
    //         },
    //       },
    //     },
    //   });
    //   totalPages = totalFavourites / limit;
    //   await redisClient.set(`user:${userId}:totalPages:`, totalPages);
    // }
    //
    const favouriteBooks = await prisma.book.findMany({
      where: {
        favourites: {
          some: {
            user_id: userId,
          },
        },
      },
      // skip: (totalPages - 1) * limit,
      // take: limit,
    });

    if (favouriteBooks.length == 0) {
      return res.status(200).json({
        success: true,
        data: {
          dataMsg: "Favourite Book not found",
        },
      });
    }

    await redisClient.set(
      `favourite:${userId}`,
      JSON.stringify(favouriteBooks),
      {
        EX: 60 * 10,
      },
    );

    return res.status(200).json({
      success: true,
      data: favouriteBooks,
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

const postFavouriteBook = async (req: Request, res: Response) => {
  try {
    const bookId = "d6305d28-a733-44ca-a0e7-8176655feaf2";
    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";

    const favourite = await prisma.favourite.upsert({
      where: {
        book_id_user_id: {
          book_id: bookId,
          user_id: userId,
        },
      },
      update: {},
      create: {
        user_id: userId,
        book_id: bookId,
      },
    });
    await redisClient.del(`favourite:${userId}`);
    return res.status(200).json({
      success: true,
      data: favourite,
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

const removeFavouriteBook = async (req: Request, res: Response) => {
  try {
    const bookId = "d6305d28-a733-44ca-a0e7-8176655feaf2";
    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";
    await prisma.favourite.deleteMany({
      where: {
        book_id: bookId,
        user_id: userId,
      },
    });

    await redisClient.del(`favourite:${userId}`);
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

export { getFavouriteBook, postFavouriteBook, removeFavouriteBook };
