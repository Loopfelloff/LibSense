import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'

type queryTypeForPost= {
    bookId? : string;
    rating? : number;
    reviewBody? : string;
}
type queryTypeForUpdate = {
    reviewId? : string;
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

	const { rating} = req.body as queryTypeForPost
	let { reviewBody, bookId} = req.body as queryTypeForPost
	const {email} =  req.user as reqUser

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


	if(!bookId || !bookId.trim()) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : 'missing bookid in the request header'
	    }

	})	
	bookId = bookId.trim()
	reviewBody = reviewBody.trim()

	const foundUser = await prisma.user.findUnique({
	    where : {
		email : email
	    }
	})
	// if the book id is non existent prisma throws a foreign key violation message, but still simplying it for the backend
	if(!foundUser)  return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : 'the user is either or has never registered'
	    }

	})	
	
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


const updateReviewHandler = async ( req : Request , res : Response)=>{
    try{

	const {reviewId, rating , reviewBody} = req.body as queryTypeForUpdate
	
	if(!reviewId || !reviewId.trim()) return res.status(400).json({
	    success: false,
	    errDetails : {
		errMsg : `missing bookId field in the request header`	
	    }
	})

	if(!rating && (!reviewBody || reviewBody.trim()==='')) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : `all the field can't be empty at the same time`
	    }
	})

	const {email} = req.user as reqUser
	

	const foundUser = await prisma.user.findUnique({
	    where : {
		email : email
	    }
	})

	if(!foundUser)  return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : 'the user account is deleted or either  has never registered'
	    }

	})	

	const foundReview  = await prisma.review.findUnique({
	    where : {
		id : reviewId
	    }
	})

	if(!foundReview) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : `the review doesn't exist`
	    }
	})


	if(foundReview.user_id !== foundUser.id) return res.status(401).json({
	    success : false,
	    errDetails : {
		errMsg : `can't update others review`	
	    }
	})

	const sendReviewBody = (!reviewBody || reviewBody.trim()==='') ? foundReview.review_body  : reviewBody.trim()
	const sendRating = (!rating)? foundReview.rating : rating 

	const reviewUpdate = await prisma.review.update({
	    where : {
		id : reviewId
	    },
	    data : {
		review_body : sendReviewBody,
		rating : sendRating
	    }
	})

	console.log(reviewUpdate)
	return res.status(201).json({
	    success : true,
	    data : reviewUpdate
	})
    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log(err.stack)
	    return res.status(500).json({
		success : true,
		errMsg : err.message,
		errName : err.name
	    })
	}
	
    }
}



export {addReviewHandler ,updateReviewHandler} 
