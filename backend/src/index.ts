import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import { router as verifyEmailHandler} from './routes/signupRoute.js'
import {router as verifyOtpHandler} from './routes/verifyOtpRoute.js'
import {router as loginHandler} from './routes/loginRoute.js'
import {router as googleLoginHandler} from './routes/googleLoginRoute.js'
import {router as failureHandler} from './routes/failureRoute.js'
import {router as viewBookHandler} from './routes/viewBookRouter.js'
import {router as bookReviewHandler} from './routes/bookreviewRoutes.js'
import { authenticationMiddleware } from './middlewares/authenticationMiddleware.js'
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
// we have to later on add middleware instead to verify if this is from a verified request or not.
app.use("/review" , authenticationMiddleware) // use this middelware for every restricted request 
app.use("/review" , bookReviewHandler) // use this middelware for every restricted request 



app.listen(process.env.PORT , ()=>{
    console.log('Listening to port ' , process.env.PORT)
})



