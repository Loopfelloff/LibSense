import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'
import type { reqUser } from '../types/reqUserType.js'
const addInterestHandler = async (req : Request , res:Response)=>{

    try{

	let {genreId} = req.body as {genreId : string} 

	const user = req.user as reqUser 
	
	if(!genreId || genreId.trim() === "") return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : `missing genre in the request header`
	    }
	})
	const foundGenre = await prisma.genre.findUnique({
	    where : {
		id : genreId
	    }
	})

	if(!foundGenre) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : `such genre doesn't even exists`
	    }
	})

	const foundUserGenre = await prisma.userPreferences.findUnique({
	    where : {
		user_genre_preference :{
		    user_id : user.id,
		    genre_id : foundGenre.id
		}
	    }
	})

	if(foundUserGenre) return res.status(409).json({
	    success : false,
	    errDetails : {
		errMsg : `the particular genre already exists for the given user`
	    }
	})

	const result = await prisma.userPreferences.create({
	    data :{
		user_id : user.id,
		genre_id : foundGenre.id,

	    }
	}) 

	return res.status(200).json({
	    success : true,
	    data : result
	})



    }
    catch(err : unknown){
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

const getUserPreferences = async (req : Request , res : Response)=>{
    try {

	const user = req.user as reqUser

	const userPreferences = await prisma.userPreferences.findMany({
	    where : {
		user_id : user.id
	    },
	    include : {
		genre : true
	    }
	})

	return res.status(200).json({
	    success : true,
	    data : userPreferences
	})

    }
    catch(err : unknown) {
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

const deleteUserPreferences = async (req: Request , res : Response)=>{

    try {
	const {userPreferenceId} = req.query as {userPreferenceId : string}

	const deleteResult = await prisma.userPreferences.delete({
	    where : {
		id : userPreferenceId 
	    }
	})

	return res.status(200).json({
	    success : true,
	    data : deleteResult
	})

    }
    catch(err : unknown) {
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

const findGenreByName = async (req : Request ,  res : Response)=>{
    try {

	let {genreName} = req.query as {genreName : string}

	const user = req.user as reqUser	

	if(!genreName || genreName.trim() === "") return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : `genreName missing in the request header` 
	    }
	})

	genreName = genreName.toLowerCase().trim()

	const foundUserPrefferedGenre = await prisma.userPreferences.findMany({
	    where : {
		user_id : user.id
	    },
	    select :{
		genre_id : true 
	    }
	})


	const foundUserPrefferedGenreId  = foundUserPrefferedGenre.map(item=>{
	    return item.genre_id
	})

	const foundGenre = await prisma.genre.findMany({
	    where : {
		id : {
		    notIn : foundUserPrefferedGenreId
		},
		genre_name : {
		    contains : genreName,
		}
	    },

	    skip : 0,
	    take : 10
	})

	return res.status(200).json({
	    success : true,
	    data : foundGenre 
	})

    }
    catch(err : unknown){
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


export {addInterestHandler , getUserPreferences , deleteUserPreferences , findGenreByName}
