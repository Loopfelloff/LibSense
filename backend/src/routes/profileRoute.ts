import express from "express";
import { getProfileController } from "../controllers/profileController.js";
const profileRouter = express.Router();

profileRouter.get("/", getProfileController);

export { profileRouter };
