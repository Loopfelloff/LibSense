import express from "express";
import { getProfileController } from "../controllers/profileController.js";
import { postProfilePicController } from "../controllers/profilePicController.js";
import { upload } from "../middlewares/multer.js";
const profileRouter = express.Router();

profileRouter.get("/", getProfileController);
profileRouter.post(
  "/profilepicture/uploads",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  postProfilePicController,
);

export { profileRouter };
