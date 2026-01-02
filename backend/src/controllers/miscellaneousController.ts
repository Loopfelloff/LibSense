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

const mockBookData = async (req: Request , res : Response)=>{
    try {
const result = await prisma.book.create({
  data: {
    isbn: "9780132350884",
    book_cover_image : 'a book for clean code',
    book_title: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",

    book_written_by: {
      create: [
        {
          book_author: {
            create: {
              author_first_name: "Robert",
              author_middle_name: "C.",
              author_last_name: "Martin",
            },
          },
        },
        {
          book_author: {
            create: {
              author_first_name: "Another",
              author_last_name: "Author",
            },
          },
        },
      ],
    },
  },
   include : {
		book_written_by : {
		    include : {
			book_author : true
		    }
		}
	    }
})


	    res.status(200).json({
		success : true,
		data  :result 
	})

    }
    catch(err : unknown) {
	if(err instanceof Error)
	    {
	    console.log(err.stack)
	    res.status(500).json({
		success : false,
		errMsg:err.message,
		errName : err.name
	})
	}
    }
} 
export { getMutualBooks , mockBookData};
