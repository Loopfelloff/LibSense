import type {Request , Response} from 'express'

const failureHandler = async (req : Request , res : Response)=>{
    return res.redirect('http://localhost:5173/login')
}

export {failureHandler}
