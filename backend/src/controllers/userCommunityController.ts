import type { Request, Response } from "express";
import axios from 'axios'
import { prisma } from "../config/prismaClientConfig.js";
import type { reqUser } from "../types/reqUserType.js";

const userCommunityHandler = async(req : Request , res : Response)=>{
    try{

	const user = req.user as reqUser

	let userCommunity : string[] = []

	const foundUser = await prisma.user.findUnique({
	    where :{
		id : user.id
	    }
	})

	if(!foundUser) return res.status(404).json({
	    success : false,
	    errMsg : "the user account doesn't exist"
	})

	try{

	    const response = await axios.get(`http://127.0.0.1:8000/user_clustering/${foundUser.id}`)

	    userCommunity = response.data.community as string[]

	}
	catch(error : unknown){
	    console.log("in this one ")
	    if(axios.isAxiosError(error)){
		console.log(error.response?.data)
		return res.status(500).json({
		    success:false,
		    errDetails:{
			errName : error.name,
			errMsg : error.message
		    }
		})

	    }

	}

	const communityData = await prisma.user.findMany({
	    where : {
		id : {
		    in : userCommunity
		}
	    }
	    ,
	    select : {
		id : true,
		first_name : true,
		middle_name : true,
		last_name : true,
		email : true,
		profile_pic_link:true
	    }
	})

	return res.status(200).json({
	    success : true,
	    data : communityData
	})

    }
    catch(err : unknown){

	if(err instanceof Error){
	    res.status(500).json({
		success : false,
		errDetails: {
		    errName : err.name,
		    errMsg : err.message
		}
	    })
	    console.log(err.stack)
	}

    }
}

export {userCommunityHandler}

