import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'

type queryType = {
    bookId? : string;
    rating? : number;
    reviewBody? : string;
}
type reqUser = {
    email : string;
    firstName : string;
    lastName : string;
    middleName : string
}

const addReviewHandler = async (req : Request , res:Response)=>{

    try{

	const {bookId , rating} = req.body as queryType
	let { reviewBody} = req.body as queryType
	const {email , firstName, lastName  , middleName } =  req.user as reqUser

	if(!rating) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : 'missing rating'
	    }

	})	

	if(!reviewBody ||  !reviewBody.trim()) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : 'missing reviewBody in the request header'
	    }

	})	


	if(!bookId) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : 'missing bookid in the request header'
	    }

	})	

	reviewBody = reviewBody.trim()

	const foundUser = await prisma.user.findUnique({
	    where : {
		email : email
	    }
	})
	// if the book id is non existent prisma throws a foreign key violation message, but still simplying it for the backend
	
	const foundBook = await prisma.book.findUnique({
	    where : {
		id : bookId
	    }
	})

	if(!foundBook) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : `the book doens't exists` 
	    }
	})

	if(!foundUser)  return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : 'the user is either or has never registered'
	    }

	})	

	// if the book alreayd has a review by someone particular we want to prevent them from re-entering their reivew so to counter that prisma gives the unique constraint violation but writing my own custom one to prevent that from happening if you are wondering what this is for.
	
	const foundUserReview = await prisma.review.findUnique({
	    where : {
		book_user_unique_review : {
		    book_id : bookId,
		    user_id : foundUser.id
		}
	    }
	})

	if(foundUserReview) return res.status(409).json({

	    success : false,
	    errDetails : {
		errMsg : 'the review already exists'
	    }
	})

	const result = await prisma.review.create({
	    data : {

		rating : rating,
		review_body : reviewBody,
		user_id : foundUser.id,
		book_id : bookId

	    }
	})

	console.log(result)

	return res.status(201).json({
	    success : true,
	    data : result
	})

    }
    catch(err:unknown){
	if(err instanceof Error){
	    console.log(err.stack)
	    return res.status(500).json({
		success : false,
		errMsg : err.message,
		errName : err.name
	    })
	}
    }
}

export {addReviewHandler} 
