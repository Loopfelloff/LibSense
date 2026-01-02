import type {Request , Response} from 'express'

const authHandler = async (req : Request , res : Response)=>{

    const {user} = req

    const payloadToSend = {loggedIn : true , ...user}

    return res.status(200).json({
	data : payloadToSend
    })
}

export {authHandler}
