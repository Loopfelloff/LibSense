import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type{Request, Response} from 'express'
import { router as verifyEmailHandler } from "./routes/signupRoute.js";
import { router as verifyOtpHandler } from "./routes/verifyOtpRoute.js";
import { router as loginHandler } from "./routes/loginRoute.js";
import { router as googleLoginHandler } from "./routes/googleLoginRoute.js";
import { profileRouter } from "./routes/profileRoute.js";
import { favouriteRouter } from "./routes/favouriteRoute.js";
import { router as failureHandler } from "./routes/failureRoute.js";
import { router as topRatedBooksHandler } from "./routes/topRatedBooksRouter.js";
import { router as viewBookHandler } from "./routes/viewBookRouter.js";
import { router as checkIfStatusExistHandler } from "./routes/checkIfStatusExistRoute.js";
import { router as mockDataHandler } from "./routes/mockDataRoute.js";
import { router as interestHandler } from "./routes/interestRoute.js";
import { router as addToWillReadHandler } from "./routes/addToWillReadRoute.js";
import {router as genreClassificationHandler} from "./routes/genreClassificationRoute.js"
import { authenticationMiddleware } from "./middlewares/authenticationMiddleware.js";
import { checkForEmailEntryHandler } from "./controllers/checkForEmailEntryController.js";
import { router as bookReviewHandler } from "./routes/bookreviewRoutes.js";
import {router as userCommunityHandler} from  "./routes/userCommunityRoute.js"
import { corsOptions } from "./config/corsConfig.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { bookStatusRouter } from "./routes/bookStatusRoute.js";
import { authHandler } from "./controllers/authController.js";
import { userAuthenticationMiddleware } from "./middlewares/userAuthenticationMiddleware.js";
import {adminAuthenticationMiddleware} from "./middlewares/adminAuthenticationMiddleware.js";
import { genSaltSync, hashSync } from "bcrypt-ts"
import {
  getAllUserProfile,
  getUserProfile,
} from "../prisma/vector_embedding/userEmbedding.js";
import { getAllBooks } from "../prisma/vector_embedding/bookEmbedding.js";
import { recommendationRouter } from "./routes/recommendationRoute.js";
import { router as adminRoutes } from "./routes/adminPanelRoutes.js"

import { logOutRouter } from "./routes/logoutRoute.js";

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
app.use("/mock", mockDataHandler); // remove the underlying handler and stuff after the mocking or testing phase is complete during deployment
// we have to later on add middleware instead to verify if this is from a verified request or not.


app.use("/book", authenticationMiddleware, userAuthenticationMiddleware);
app.use("/auth", authenticationMiddleware);
app.use("/auth", authHandler);
app.use("/review", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/review", bookReviewHandler);
app.use("/topRated", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/topRated", topRatedBooksHandler);
app.use("/viewBook", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/viewBook", viewBookHandler);
app.use("/interest", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/interest", interestHandler);
app.use("/addToWillRead", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/addToWillRead", addToWillReadHandler);
app.use("/checkIfStatusExist", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/checkIfStatusExist", checkIfStatusExistHandler);
app.use("/genreClassification", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/genreClassification", genreClassificationHandler);
app.use("/registerAccount", verifyEmailHandler);
app.use("/verifyOtp", verifyOtpHandler);
app.use("/users", authenticationMiddleware , userAuthenticationMiddleware);
app.use("/users/profile", profileRouter);
app.use("/users/books/favorites", favouriteRouter);
app.use("/logout",logOutRouter);
app.use("/users/books/status", bookStatusRouter);
app.use("/users/books/recommendations", recommendationRouter);
app.use("/userClustering", authenticationMiddleware, userAuthenticationMiddleware)
app.use("/userClustering", userCommunityHandler)
app.use("/admin", authenticationMiddleware , adminAuthenticationMiddleware)
app.use('/admin', adminRoutes)


app.listen(process.env.PORT, () => {
  console.log("Listening to port ", process.env.PORT);
});
