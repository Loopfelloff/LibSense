import express from 'express'
const router = express.Router()
import { addInterestHandler } from '../controllers/interestController.js'

router.route("/add").post(addInterestHandler)


export {router}
