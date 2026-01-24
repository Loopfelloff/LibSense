import express from 'express'
const router = express.Router()
import { checkIfStatusExists } from '../controllers/miscellaneousController.js'

router.route("/").get(checkIfStatusExists)

export {router}
