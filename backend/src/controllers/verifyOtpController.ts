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
    
    const {email} = req.cookies


    if(!email) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : 'missing cookies in the request header'
	    }
	})

    if(otp==='' || !otp) return res.status(400).json({
	success : false,
	errDetails : {
	    errMsg : 'empty otp sent'
	}
	
    })

    console.log(email.email)

    const userDetails = await redisClient.hGetAll(email)

    if(Object.keys(userDetails).length === 0) return res.status(404).json({
	    success : false,
	    errDetails : {
		errMsg : 'either the otp expired or the invalid otp entered'
	    }
	})

    if(userDetails.otp !== otp) return res.status(400).json({
	    success : false,
	    errDetails : {
		errMsg : `the session email doesn't match up the otp value`
	    }
	})
    const role = await prisma.userRole.findFirst({
	    where : {role : Roles.USER}
	})
    
    if(!role) return res.status(500).json({
	    success : false,
	    "error":{
		"errName" : `role is empty`,
		"errMsg" : 'the role is somehow empty'	    }

	})

    const result = await prisma.user.create({
	    data:{
		first_name : userDetails.firstName,
		middle_name : userDetails.middleName,
		last_name : userDetails.lastName,
		email : email,
		password : userDetails.password,
		user_role_id : role.id,
	    }
	})

    console.log(result)

    await redisClient.del(email)

    res.clearCookie('email' , {maxAge : 60*60*1000 , httpOnly : true})

    const toSend = {
	    firstName : userDetails.firstName ,
	    middleName : userDetails.middleName ,
	    lastName : userDetails.lastName ,
	    email : email ,
	    user_role_id : result.user_role_id ,
	}

    return res.status(201).json({
	    success : true,
	    data : toSend
	})
	
    
    }
    catch(err : unknown){

    if(err instanceof Error){
	    console.log(err.stack)
	    return res.status(500).json({
		"success" : false, 
		"error":{
		    "errName" : err.name,
		    "errMsg" : err.message
		}
	    })
    }


}
}

export {verifyOtpHandler}
