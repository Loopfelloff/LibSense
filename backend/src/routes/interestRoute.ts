import express from 'express'
const router = express.Router()
import { addInterestHandler ,getUserPreferences ,deleteUserPreferences} from '../controllers/interestController.js'

router.route("/add").post(addInterestHandler)
router.route("/get").get(getUserPreferences)
router.route("/delete").delete(deleteUserPreferences)


export {router}
