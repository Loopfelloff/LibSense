import express from "express";
import { logOut } from "../controllers/logoutController.js";
const logOutRouter = express.Router();

logOutRouter.get("/", logOut);

export { logOutRouter };
