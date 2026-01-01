import express from 'express'
const router = express.Router()
import {addReviewHandler, updateReviewHandler} from '../controllers/bookreviewController.js'

router.route("/add").post(addReviewHandler)
router.route("/update").put(updateReviewHandler)

export {router}

