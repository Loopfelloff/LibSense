import express from 'express'
const router = express.Router()
import { mockBookData } from '../controllers/miscellaneousController.js'

router.route('').post(mockBookData)
export {router}

