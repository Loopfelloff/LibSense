import express from "express";
import { getProfileController } from "../controllers/profileController.js";
import { postProfilePicController } from "../controllers/profilePicController.js";
import { upload } from "../middlewares/multer.js";
import { changePassword } from "../controllers/miscellaneousController.js";
const profileRouter = express.Router();

profileRouter.get("/", getProfileController);
profileRouter.post(
  "/profilepicture/upload",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  postProfilePicController,
);
profileRouter.post("/changepassword/", changePassword);

export { profileRouter };
