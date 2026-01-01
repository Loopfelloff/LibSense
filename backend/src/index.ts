import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { router as verifyEmailHandler } from "./routes/signupRoute.js";
import { router as verifyOtpHandler } from "./routes/verifyOtpRoute.js";
import { router as loginHandler } from "./routes/loginRoute.js";
import { router as googleLoginHandler } from "./routes/googleLoginRoute.js";
import { profileRouter } from "./routes/profileRoute.js";
import { favouriteRouter } from "./routes/favouriteRoute.js";
import { router as failureHandler } from "./routes/failureRoute.js";
import { router as viewBookHandler } from "./routes/viewBookRouter.js";
import { authenticationMiddleware } from "./middlewares/authenticationMiddleware.js";
import { checkForEmailEntryHandler } from "./controllers/checkForEmailEntryController.js";
import { corsOptions } from "./config/corsConfig.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./config/prismaClientConfig.js";

import { bookStatusRouter } from "./routes/bookStatusRoute.js";
const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/registerAccount", verifyEmailHandler);
app.use("/verifyOtp", verifyOtpHandler);
app.use("/checkForEmail", checkForEmailEntryHandler);
app.use("/login", loginHandler);
app.use("/auth", googleLoginHandler);
app.use("/failure", failureHandler);
// we have to later on add middleware instead to verify if this is from a verified request or not.
app.use("/book", authenticationMiddleware); // use this middelware for every restricted request

app.listen(process.env.PORT, () => {
  console.log("Listening to port ", process.env.PORT);
});

app.use("/registerAccount", verifyEmailHandler);
app.use("/verifyOtp", verifyOtpHandler);
app.use("/users/profile", profileRouter);
app.use("/users/books/favourites", favouriteRouter);
app.use("/users/books/status", bookStatusRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening to port", process.env.PORT);
});
