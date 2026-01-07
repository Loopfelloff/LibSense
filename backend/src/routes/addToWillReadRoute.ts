import express from 'express'
const router = express.Router()
import { addToWillRead } from '../controllers/miscellaneousController.js'

router.route("/").post(addToWillRead)


export {router}


