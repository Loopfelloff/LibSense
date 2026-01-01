import express from 'express'
const router = express.Router()
import {addReviewHandler, updateReviewHandler, deleteReviewHandler} from '../controllers/bookreviewController.js'

router.route("/add").post(addReviewHandler)
router.route("/update").put(updateReviewHandler)
router.route("/delete").delete(deleteReviewHandler)

export {router}

