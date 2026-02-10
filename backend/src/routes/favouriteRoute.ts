import express from "express"
import {
  getFavouriteBook,
  postFavouriteBook,
  removeFavouriteBook,
} from "../controllers/favouritesBookController.js"
const favouriteRouter = express.Router()

favouriteRouter.get("/", getFavouriteBook)
favouriteRouter.post("/", postFavouriteBook)
favouriteRouter.delete("/", removeFavouriteBook)

export { favouriteRouter }
