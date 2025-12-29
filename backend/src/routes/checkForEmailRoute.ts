import express from 'express'
const router = express.Router()
import {checkForEmailEntryHandler} from '../controllers/checkForEmailEntryController.js'

router.route('/').get(checkForEmailEntryHandler)

export {router}
