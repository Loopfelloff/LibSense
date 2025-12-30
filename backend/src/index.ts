import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { router as verifyEmailHandler } from "./routes/signupRoute.js";
import { router as verifyOtpHandler } from "./routes/verifyOtpRoute.js";
import { profileRouter } from "./routes/profileRoute.js";
import { favouriteRouter } from "./routes/favouriteRoute.js";

import { corsOptions } from "./config/corsConfig.js";
import cors from "cors";
import { bookStatusRouter } from "./routes/bookStatusRoute.js";
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/registerAccount", verifyEmailHandler);
app.use("/verifyOtp", verifyOtpHandler);
app.use("/users/profile", profileRouter);
app.use("/users/books/favourites", favouriteRouter);
app.use("/users/books/status", bookStatusRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening to port", process.env.PORT);
});
