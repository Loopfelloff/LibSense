import express from 'express'
const router = express.Router()
import { failureHandler } from '../controllers/failureRedirect.js'
router.route('/').get(failureHandler)
export {router}
