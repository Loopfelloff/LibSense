import express from 'express'
const router = express.Router()
import { verifyOtpHandler } from '../controllers/verifyOtpController.js'

router.route("/").post(verifyOtpHandler)

export {router}
