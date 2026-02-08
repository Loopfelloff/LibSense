import express from 'express'
const router = express.Router()
import {genreClassificationHandler} from '../controllers/genreClassificationController.js' 

router.route("/").post(genreClassificationHandler)

export {router}
