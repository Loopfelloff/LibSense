import express from "express";
import { getSimilarBooks } from "../controllers/searchSimilarBooks.js";
const searchRouter = express.Router();

searchRouter.post("/", getSimilarBooks);

export { searchRouter };
