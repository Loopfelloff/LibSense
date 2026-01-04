import express from "express"

import {
  deleteBookByStatus,
  editBookByStatus,
  getBooksByStatus,
} from "../controllers/bookStatusController.js"

import { getMutualBooks } from "../controllers/miscellaneousController.js"

const bookStatusRouter = express.Router()

bookStatusRouter.get("/", getBooksByStatus)
bookStatusRouter.get("/mutual", getMutualBooks)
bookStatusRouter.post("/", editBookByStatus)
bookStatusRouter.delete("/", deleteBookByStatus)

export { bookStatusRouter }
