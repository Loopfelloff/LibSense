import type { Request, Response } from "express";
import { redisClient } from "../config/redisConfiguration.js";
import { prisma } from "../config/prismaClientConfig.js";

const getFavouriteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };
    const page = Number(req.query.page) || 1;
    const take = 5;

    let totalCount = Number(await redisClient.get(`user:${id}:totalCount`));

    if (!totalCount) {
      totalCount = await prisma.book.count({
        where: {
          favourites: {
            some: {
              user_id: id,
            },
          },
        },
      });
      await redisClient.set(`user:${id}:totalCount:`, totalCount);
    }

    const totalPages = Math.ceil(totalCount / take);
    const skip = Number(page - 1) * Number(take);

    const favouriteBooks = await prisma.book.findMany({
      where: {
        favourites: {
          some: {
            user_id: id,
          },
        },
      },
      skip,
      take,
    });

    if (favouriteBooks.length == 0) {
      return res.status(200).json({
        success: true,
        data: {
          dataMsg: "Favourite Book not found",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: favouriteBooks,
      pagination: {
        currentPage: Number(page),
        totalPages,
        hasNextPage: Number(page) < totalPages,
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
    const { bookId } = req.params as { bookId: string };
    const { id } = req.user as { id: string };
    await prisma.favourite.deleteMany({
      where: {
        book_id: bookId,
        user_id: id,
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

export { getFavouriteBook, postFavouriteBook, removeFavouriteBook };
