import express from 'express'
const router = express.Router()
import {addReviewHandler} from '../controllers/bookreviewController.js'

router.route("/add").post(addReviewHandler)

export {router}

