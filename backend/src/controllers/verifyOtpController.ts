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
/**
 *
model User {
    id                        String                    @id @default(uuid())
    first_name                String
    middle_name               String?
    last_name                 String
    email                     String                    @unique
    password                  String
    profile_pic_link          String?
    user_role_id              String
    user_role                 UserRole                  @relation(fields: [user_role_id], references: [id])
    user_preferences          UserPreferences[]
    conversation_participants ConversationParticipant[]
    sent_messages             Message[]
    book_status_val           BookStatusVal[]
    favourites                Favourite[]
    review                    Review[]

    @@map("user")
}
**/
    console.log(Roles.USER)
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
		email : userDetails.email,
		password : userDetails.password,
		user_role_id : role.id,
	    }
	})

    console.log(result)

    await redisClient.del(otp)

    const toSend = {
	    firstName : userDetails.firstName ,
	    middleName : userDetails.middleName ,
	    lastName : userDetails.lastName ,
	    email : userDetails.email ,
	    user_role_id : result.user_role_id ,
	}

    return res.status(200).json({
	    success : true,
	    data : toSend
	})
	
    
    }
    catch(err){

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
