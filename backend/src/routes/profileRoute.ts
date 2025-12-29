import express from "express";
import { getProfileController } from "../controllers/profileController.js";
const profileRouter = express.Router();

profileRouter.get("/profile", getProfileController);

export { profileRouter };
