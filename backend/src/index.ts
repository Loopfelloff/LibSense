import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import { router as verifyEmailHandler} from './routes/signupRoute.js'
import {router as verifyOtpHandler} from './routes/verifyOtpRoute.js'
import {router as checkForEmailHandler} from './routes/checkForEmailRoute.js'
import { corsOptions } from './config/corsConfig.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { checkForEmailEntryHandler } from './controllers/checkForEmailEntryController.js'
const app = express()


app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())


app.use("/registerAccount", verifyEmailHandler)
app.use("/verifyOtp", verifyOtpHandler)
app.use("/checkForEmail" , checkForEmailEntryHandler)


app.listen(process.env.PORT , ()=>{
    console.log('Listening to port ' , process.env.PORT)
})



