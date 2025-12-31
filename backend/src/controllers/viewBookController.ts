import type {Request , Response} from 'express'
import { prisma } from '../config/prismaClientConfig.js'

const viewBookHandler = async (req : Request , res : Response)=>{
    try{

	const bookId = req.query?.bookId  as string

	if(!bookId) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : 'missing bookId in the request header'
	    }
	})

	const findBookDetails = await prisma.book.findUnique({
	    where : {
		id : bookId
	    },
	    include : {
		book_written_by:{
		    include : {
			book_author : {
			    include : {
				book_author_names : true
			    }
			}
		    }
		}
	    }

	})

	if(!findBookDetails) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : 'The book with the given id doesnot exist'
	    }
	})

	return res.status(200).json({
	    success : true,
	    data : findBookDetails
	})


    }
    catch(err){
	if(err instanceof Error){
	    console.log(err.stack)
	    return res.status(500).json({
		success : false,
		errMsg : err.message,
		errName : err.name,
	    })
	}
    }
}

export {viewBookHandler}
