import express from 'express'
const router = express.Router()

import { viewBookHandler } from '../controllers/viewBookController.js'

router.route("/").get(viewBookHandler)

export {router}
