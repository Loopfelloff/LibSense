import express from 'express'
import { userCommunityHandler } from '../controllers/userCommunityController.js'
const router = express.Router()
router.route("/").get(userCommunityHandler)
export {router}



