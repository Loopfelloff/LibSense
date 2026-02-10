import type {Request, Response , NextFunction} from 'express'
import type { User } from '../../generated/prisma/index.js'
import {prisma} from '../config/prismaClientConfig.js'

const adminAuthenticationMiddleware = async(req:Request , res:Response, next : NextFunction)=>{

    try{

	const user = req.user as User

	const foundUser = await prisma.user.findUnique({
	    where : {
		id : user.id
	    }
	})

	if(!foundUser) return res.status(404).json({
	    success : false,
	    errMsg : `the user account can't be found`
	})

	const userRoleId = foundUser.user_role_id

	const userRole = await prisma.userRole.findUnique({
	    where :{
		id : userRoleId
	    }
	}) 

	if(userRole?.role === "SUPERADMIN") next()
	else res.status(401).json({
		success : false,
		errMsg : `You are not authenticated to access this resource`
	    })

    }
    catch(err : unknown){
	if(err instanceof Error){
	    res.status(500).json(
		{
		    success : false,
		    errDetails : err.stack
		}
	    )
	}
    }

}
export {adminAuthenticationMiddleware}

