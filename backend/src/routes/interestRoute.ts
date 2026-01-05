import express from 'express'
const router = express.Router()
import { addInterestHandler ,getUserPreferences } from '../controllers/interestController.js'

router.route("/add").post(addInterestHandler)
router.route("/get").get(getUserPreferences)


export {router}
