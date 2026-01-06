import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'
import PG from 'pg';
import { start } from 'node:repl';

type reqBodyType = {
    startIndex? : number;
    shiftIndex? : number;
}

const topRatedBooksHandler = async (req : Request , res : Response)=>{
    try {

	let {startIndex, shiftIndex}  = req.query as reqBodyType
	if(startIndex === undefined) return res.status(400).json({
	    success : true,
	    errDetails : {
		errMsg : 'missing startIndex in the request header'
	    }
	})
	if(shiftIndex === undefined) return res.status(400).json({
	    success : true,
	    errDetails : {
		errMsg : 'missing shiftIndex in the request header'
	    }
	})
	startIndex = Number(startIndex)
	shiftIndex = Number(shiftIndex)


//	const bookResult = await prisma.book.findMany({ // so books with atelast one review pop up
//	    where : {
//		review : {
//		    some : {}
//		}
//	    }
//	    ,
//	    select : {
//		id : true
//	    },
//	    skip : startIndex,
//	    take : shiftIndex
//	})
    
	// just gives array like ['id1' , 'id2']
	
	const totalResult = await prisma.book.count({
	    where : {
		review : {
		    some : {}
		}
	    }
	})

	const tempResult = await prisma.review.groupBy({
	    by : ['book_id'],
	    orderBy : {
		_avg : {
		    rating :'desc'
		}
	    },
	    _avg : {rating : true},
	    skip : startIndex,
	    take : shiftIndex,
	})



	const result = await Promise.all(
	    tempResult.map(async (item)=>{
		return (
		{
		    ... await(prisma.book.findUnique(
			{
			    where : {
				id : item.book_id
			    },

			    select : {
				    id : true,
				    book_cover_image : true,
				    book_title : true,
				    description : true,
				}
			    
			}
		    )),
			averageRating : item._avg.rating

		    }
		)
	    })
	)	


    // paxi required data jo send garnu 
	res.status(200).json({
	    success : true,
	    data : result,
	    meta : {
		total : totalResult,
		startIndex : startIndex,
		shiftIndex : shiftIndex
	    }
	})
    }
    catch(err : unknown) {
	if(err instanceof Error){
	    console.log(err.stack)
	    res.status(500).json({
		success : false,
		errMsg : err.message,
		errName : err.name
	    })
	}
    }
}
export {topRatedBooksHandler}
