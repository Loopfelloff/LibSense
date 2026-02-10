import type { Request, Response } from "express";
import { redisClient } from "../config/redisConfiguration.js";
import axios from "axios";
import { prisma } from "../config/prismaClientConfig.js";

const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };
    const countKey = `user:${id}:recommendations`;
    const rawData = await redisClient.get(countKey);

    const cachedRecommendationBooksId = JSON.parse(rawData ?? "[]");

    let recommendationBooksId = cachedRecommendationBooksId;
    if (
      !cachedRecommendationBooksId ||
      cachedRecommendationBooksId?.length == 0
    ) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/recommend/books/${id}`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        recommendationBooksId = response.data.recommendations.map(
          ({ book_id }: { book_id: string }) => book_id,
        );
        await redisClient.set(countKey, JSON.stringify(recommendationBooksId), {
          EX: 60 * 60,
        });
      } catch (err: unknown) {
        if (err instanceof Error) console.log(err.message);
      }
    }

    const recommendationBooks = await prisma.book.findMany({
      where: {
        id: {
          in: recommendationBooksId,
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
    });

    const flattenedBooks = recommendationBooks.map((book) => {
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

    return res.status(200).json({
      success: true,
      data: flattenedBooks,
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
export { getRecommendations };