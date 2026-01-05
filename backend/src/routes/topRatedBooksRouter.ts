import express from 'express'
const router = express.Router()
import { topRatedBooksHandler } from '../controllers/topRatedBooksController.js'

router.route("/").get(topRatedBooksHandler)

export {router}
