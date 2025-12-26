import express from 'express'
const router = express.Router()
import { verifyEmailHandler } from '../controllers/signupController.js'

router.route('/').post(verifyEmailHandler)

export {router}

