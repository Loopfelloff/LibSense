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


//	const bookresult = await prisma.book.findmany({ // so books with atelast one review pop up
//	    where : {
//		review : {
//		    some : {}
//		}
//	    }
//	    ,
//	    select : {
//		id : true
//	    },
//	    skip : startindex,
//	    take : shiftindex
//	})
    
	// just gives array like ['id1' , 'id2']
	
	const whereClause = {
	    review : {
		some : {}
	    }
	}
	
	const totalResult = await prisma.book.count(
	    {
		where :whereClause 
	    }
	)
	
	const result = await prisma.book.findMany({
	    where : whereClause,
	    orderBy: [
		{
		    avg_book_rating : 'desc'
		},

	    ],
	    skip : startIndex,
	    take : shiftIndex
	})


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
