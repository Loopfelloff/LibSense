import type {Request , Response} from 'express'
import { prisma } from '../config/prismaClientConfig.js'
import { reqUser } from '../types/reqUserType.js'
const authHandler = async (req : Request , res : Response)=>{

    try{

	const user  = req.user as reqUser

	const result = await prisma.user.findUnique({
	    where : {
		id : user.id
	    }
	    ,
	    select : {
		profile_pic_link : true
	    }
	})

	if(!result) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : `the user doesn't exist or hasn't registered yet`
	    }
	})

	const payloadToSend = {loggedIn : true ,profilePicLink : result?.profile_pic_link, ...user}

	return res.status(200).json({
	    data : payloadToSend
	})

    }
    catch(err : unknown) {
	if(err instanceof Error){
	    return res.status(500).json({
		success : false,
		errMsg : err.message,
		errName : err.name
	    })
	}
    }
}

export {authHandler}
