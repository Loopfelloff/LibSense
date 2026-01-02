import type { Request, Response } from "express";
import { prisma } from "../config/prismaClientConfig.js";
import { Status } from "../../generated/prisma/index.js";

const getMutualBooks = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    const { userId } = req.params;
    // const { id } = req.body;
    const id = "403d1a57-d529-45db-a6d6-38f4204e2b8b";

    if (!userId)
      return res.status(401).json({
        success: false,
        error: {
          errorMsg: "No userid specified",
        },
      });

    const getMutualRecord = await prisma.book.findMany({
      where: {
        AND: [
          {
            user_statuses: {
              some: {
                user_id: userId,
                status: Status.READ,
              },
            },
          },
          {
            user_statuses: {
              some: {
                user_id: id,
                status: Status.READ,
              },
            },
          },
        ],
      },
      // include: {
      //   user_statuses: {
      //     where: {
      //       user_id: {
      //         in: [userId, id],
      //       },
      //     },
      //   },
      // },
    });

    return res.status(200).json({
      success: true,
      data: getMutualRecord,
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

const mockBookData = await prisma.book.create({
    data : {
	   book_title : '1984',
	   description : 'A 1949 dystopian novel exploring a totalitarian future with concepts like "Big Brother" and "thoughtcrime," examining truth and propaganda in politics.' ,
	    book_cover_image : "something for now",
	    isbn : '9783844908213',

	    book_written_by : {
		create : [
		    {
			book_author : {
			    create : {
				  author_first_name: "George",
				  author_middle_name: "",
				  author_last_name: "Martin",
			    }
			}
		    }
		]
	    }
	     
    }
})

export { getMutualBooks };
