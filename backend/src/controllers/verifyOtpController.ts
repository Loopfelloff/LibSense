import {client as redisClient} from '../config/redisConfiguration.js'
import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'

type otpType = {
    otp : string
}

enum Roles {
    SUPERADMIN = "SUPERADMIN",
    USER = "USER"
}

const verifyOtpHandler = async (req : Request , res : Response)=>{
    try{

    const {otp} : otpType = req.body 

    if(otp==='' || !otp) return res.status(400).json({
	success : false,
	errDetails : {
	    errMsg : 'empty otp sent'
	}
	
    })

    const userDetails = await redisClient.hGetAll(otp)

    if(Object.keys(userDetails).length === 0) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : 'either the otp expired or the invalid otp entered'
	    }
	})


    const result = await prisma.user.create({
	    data:{

		first_name : userDetails.firstName,
		middle_name : userDetails.middleName,
		last_name : userDetails.lastName,
		password : userDetails.password,
		user_role_id : Roles.USER
		
	    }
	})

    await redisClient.del(otp)

    return res.status(200).json({
	    success : true,
	    data : userDetails
	})
	
    
    }
    catch(err){

    if(err instanceof Error){
	    console.log(err.stack)
	    await prisma.$disconnect()
	    return res.status(500).json({
		"success" : false, 
		"error":{
		    "errName" : err.name,
		    "errMsg" : err.message
		}
	    })
    }


}
    finally{
	await prisma.$disconnect()
    }
}

export {verifyOtpHandler}
