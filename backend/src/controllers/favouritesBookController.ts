import type { Request, Response } from "express";
import { redisClient } from "../config/redisConfiguration.js";
import { prisma } from "../config/prismaClientConfig.js";

const getFavouriteBook = async (req: Request, res: Response) => {
  try {
    const userId = "0385fb63-c60e-4e7e-9767-c585f050c164";
    const key = `user:${userId}:favourites`;
    const cachedFavourite = await redisClient.get(key);
    if (cachedFavourite) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedFavourite),
      });
    }

    const favouriteBooks = await prisma.book.findMany({
      where: {
        favourites: {
          some: {
            user_id: userId,
          },
        },
      },
    });

    if (favouriteBooks.length == 0) {
      return res.status(400).json({
        success: false,
        error: {
          errMsg: "Favourite Book not found",
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
    const userId = "0385fb63-c60e-4e7e-9767-c585f050c164";
    const createFavourite = await prisma.favourite.create({
      data: {
        user_id: userId,
        book_id: bookId,
      },
    });
    await redisClient.del(`favourite:${userId}`);
    return res.status(201).json({
      success: true,
      data: createFavourite,
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
    const userId = "0385fb63-c60e-4e7e-9767-c585f050c164";
    const deleteFavourite = await prisma.favourite.delete({
      where: {
        book_id_user_id: {
          book_id: bookId,
          user_id: userId,
        },
      },
    });
    if (!deleteFavourite) {
      return res.status(400).json({
        success: false,
        error: {
          errorMsg: "No such favourite book for the user",
        },
      });
    }

    await redisClient.del(`favourite:${userId}`);
    return res.status(201).json({
      succes: true,
      data: deleteFavourite,
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
