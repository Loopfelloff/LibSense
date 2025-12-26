import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import { router as verifyEmailHandler} from './routes/signupRoute.js'
import { corsOptions } from './config/corsConfig.js'
import cors from 'cors'
const app = express()


app.use(cors(corsOptions))
app.use(express.json())


app.use("/registerAccount", verifyEmailHandler)


app.listen(process.env.PORT , ()=>{
    console.log('Listening to port ' , process.env.PORT)
})



