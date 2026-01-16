import dotenv from 'dotenv'
dotenv.config()
import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'
import jwt from 'jsonwebtoken';

type userType = {

    providerId : string;
    firstName : string;
    middleName : string;
    lastName : string;
    email : string;
    profilePicLink : string
	
}

const googleLoginHandler = async (req : Request , res : Response)=>{

    let accessToken : string = ""
    let refreshToken : string = ""

    try{
    
	const user = req.user as userType | null

	if(!user) return res.redirect('http://localhost:5173/login')

	const {providerId, firstName , middleName , lastName, email , profilePicLink} = user

	console.log(user)

	const foundUser =  await prisma.user.findUnique({
	    where : {
		email : email
	    },

	    select : {
		id : true,
		email : true,
		provider_id : true,
		first_name : true,
		middle_name : true,
		last_name : true,
		profile_pic_link : true
	    }
	    
	})

	if(!foundUser){


	   const role = await prisma.userRole.findFirst({
		where :{
		    role : "USER"
		}
	    })

	  if(!role) return res.status(404).json({
		success : false,
		errDetails : {
		    errMsg : 'the role is gone somehow'
		}
	    })

	   const result = await prisma.user.create({
		data : {
		    first_name : firstName,
		    middle_name : middleName,
		    last_name : lastName || '',
		    email : email,
		    provider_id : String(providerId),
		    user_role_id : role.id,
		    profile_pic_link : profilePicLink
		}
	    }) 
	 accessToken =  jwt.sign({
	    id : result.id,
	    email : user.email,
	    firstName : user.firstName,
	    middleName : user.middleName,
	    lastName: user.lastName
	} , String(process.env.ACCESS_TOKEN_SECRET) , {
	    expiresIn : '30m'
	    })
	 refreshToken =  jwt.sign({
	    id : result.id,
	    email : user.email,
	    firstName : user.firstName,
	    middleName : user.middleName,
	    lastName : user.lastName
	} , String(process.env.REFRESH_TOKEN_SECRET) , {
	    expiresIn : '30d'
	    })

	    console.log('new user created' , result)
	}

	else {

	    if(foundUser.provider_id === providerId){
		const result = 	await prisma.user.update({ 
		    where : {
			provider_id : providerId
		    },
		    data : {
			email : email,
			first_name : firstName,
			middle_name : middleName || '', 
			last_name : lastName,
			profile_pic_link : profilePicLink
		    }
		})

		console.log('changed' , result)
	    }
	 accessToken =  jwt.sign({
	    id : foundUser.id,
	    email : user.email,
	    firstName : user.firstName,
	    middleName : user.middleName,
	    lastName: user.lastName
	} , String(process.env.ACCESS_TOKEN_SECRET) , {
	    expiresIn : '30m'
	    })
	 refreshToken =  jwt.sign({
	    id : foundUser.id,
	    email : user.email,
	    firstName : user.firstName,
	    middleName : user.middleName,
	    lastName : user.lastName
	} , String(process.env.REFRESH_TOKEN_SECRET) , {
	    expiresIn : '30d'
	    })

	}


	res.cookie('accessToken' , accessToken)
	res.cookie('refreshToken' , refreshToken)

	console.log('the user already existed sso' , user)

	return res.redirect("http://localhost:5173/dashboard")

    }
    catch(err : unknown){

	if(err instanceof Error){
	    console.log(err.stack)
	    return res.redirect("http://localhost:5173/login")
	}
    }

}

export {googleLoginHandler}
