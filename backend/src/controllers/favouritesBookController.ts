import type { Request, Response } from "express";
import { redisClient } from "../config/redisConfiguration.js";
import { prisma } from "../config/prismaClientConfig.js";
import { Queue } from "bullmq";

const queue = new Queue("user_embeddings");

const getFavouriteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };
    const page = Number(req.query.page) || 1;
    const take = 5;
    const countKey = `user:${id}:totalCount`;
    let totalCount = Number(await redisClient.get(countKey));

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
      await redisClient.setEx(countKey, 60 * 5, JSON.stringify(totalCount));
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
      select: {
        id: true,
        book_cover_image: true,
        book_title: true,
        avg_book_rating: true,
        book_written_by: {
          select: {
            book_author: {
              select: {
                id: true,
                author_first_name: true,
                author_last_name: true,
                author_middle_name: true,
              },
            },
          },
        },
        book_genres: {
          select: {
            genre: {
              select: {
                id: true,
                genre_name: true,
              },
            },
          },
        },
      },
      skip,
      take,
    });

    const flattenedBooks = favouriteBooks.map((book) => {
      // Average rating

      return {
        id: book.id,
        title: book.book_title,
        coverImage: book.book_cover_image,

        authors: book.book_written_by.map((bw) => {
          const a = bw.book_author;
          return [a.author_first_name, a.author_middle_name, a.author_last_name]
            .filter(Boolean)
            .join(" ");
        }),

        genres: book.book_genres.map((bg) => bg.genre.genre_name),

        averageRating: book.avg_book_rating,
      };
    });

    if (favouriteBooks.length == 0) {
      return res.status(200).json({
        success: true,
        data: {
          dataMsg: "Favourite Book not found",
        },
        pagination: {
          currentPage: Number(page),
          totalPages,
          hasNextPage: Number(page) < totalPages,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: flattenedBooks,
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
    const { bookId } = req.params as { bookId: string };
    const { id } = req.user as { id: string };
    const favourite = await prisma.favourite.upsert({
      where: {
        book_id_user_id: {
          book_id: bookId,
          user_id: id,
        },
      },
      update: {},
      create: {
        user_id: id,
        book_id: bookId,
      },
    });

    await queue.add(
      "user_embeddings",
      {
        id,
      },
      {
        jobId: id,
        attempts: 3,
        removeOnComplete: true,
        delay: 10000,
      },
    );

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

    await queue.add(
      "user_embeddings",
      {
        id,
      },
      {
        jobId: id,
        attempts: 3,
        delay: 10000,
        removeOnComplete: true,
      },
    );

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
