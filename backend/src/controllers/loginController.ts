import dotenv from 'dotenv'
dotenv.config()
import type {Request , Response } from 'express'
import {prisma} from '../config/prismaClientConfig.js'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcrypt-ts'
const loginHandler = async (req : Request , res : Response)=>{
    
    try{

	const {email , password} = req.body

	const errMsg : string = (!email) ? 'missing email in the request header' : (!password) ? 'missing password in the request header' : ''

	const errJson =  {
	    success : false,
	    errDetail : {
		errMsg : errMsg
	    } 
	}

	if(!email || !password) return res.status(400).json(errJson)

	const foundUser = await prisma.user.findUnique({
	    where : {
		email : email
	    }
	    ,
	    select : {
		email : true,
		password : true,
		first_name: true,
		middle_name : true,
		last_name : true
	    }
	})

	errJson.errDetail.errMsg= 'the user is not reigstered'

	if(!foundUser) return res.status(404).json(errJson)

	const isAMatch = compareSync(password,  foundUser.password)

	errJson.errDetail.errMsg = `the password is incorrect`

	if(!isAMatch) return res.status(401).json(errJson)

	const accessTokenSecret : string = String(process.env.ACCESS_TOKEN_SECRET)
	const refreshTokenSecret : string = String(process.env.REFRESH_TOKEN_SECRET)

    
	const accessToken  = jwt.sign({email : email , first_name : foundUser.first_name  , last_name : foundUser.last_name , middle_name : foundUser.middle_name  } , accessTokenSecret  , {expiresIn : '30m'})

	const refreshToken = jwt.sign({email : email , first_name : foundUser.first_name  , last_name : foundUser.last_name , middle_name : foundUser.middle_name  },  refreshTokenSecret , {expiresIn : '30d'})

	res.cookie('accessToken', accessToken , {
	    maxAge : 30*24*60*60*1000,
	    httpOnly : true
	})
	res.cookie('refreshToken', refreshToken , {
	    maxAge : 30*24*60*60*1000,
	    httpOnly : true
	})


	return res.status(200).json({
	    success : true,
	    data : {
		email : foundUser.email,
		first_name : foundUser.first_name,
		middle_name : foundUser.middle_name,
		last_name : foundUser.last_name,
	    }
	})

	
    }
    catch(err){
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

export {loginHandler}
