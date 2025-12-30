import express from "express";
import {
  deleteBookByStatus,
  editBookByStatus,
  getBooksByStatus,
} from "../controllers/bookStatusController.js";
const bookStatusRouter = express.Router();

bookStatusRouter.get("/", getBooksByStatus);
bookStatusRouter.post("/", editBookByStatus);
bookStatusRouter.delete("/", deleteBookByStatus);

export { bookStatusRouter };
