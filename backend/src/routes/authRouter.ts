import express from 'express'
const router = express.Router()

import { authHandler } from '../controllers/authController.js'

router.route('/').get(authHandler)

export {router}
