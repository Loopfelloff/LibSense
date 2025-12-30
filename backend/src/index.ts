import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import { router as verifyEmailHandler} from './routes/signupRoute.js'
import {router as verifyOtpHandler} from './routes/verifyOtpRoute.js'
import {router as loginHandler} from './routes/loginRoute.js'
import {router as googleLoginHandler} from './routes/googleLoginRoute.js'
import {router as failureHandler} from './routes/failureRoute.js'
import { checkForEmailEntryHandler } from './controllers/checkForEmailEntryController.js'
import { corsOptions } from './config/corsConfig.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()


app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())


app.use("/registerAccount", verifyEmailHandler)
app.use("/verifyOtp", verifyOtpHandler)
app.use("/checkForEmail" , checkForEmailEntryHandler)
app.use("/login", loginHandler)
app.use("/auth",  googleLoginHandler)
app.use("/failure",  failureHandler)


app.listen(process.env.PORT , ()=>{
    console.log('Listening to port ' , process.env.PORT)
})



