import { redisClient } from "../config/redisConfiguration.js";
import {
  checkUsernameValidity,
  checkEmailValidity,
  checkPasswordValidity,
} from "../utils/formValidation.js";
import nodemailer from "nodemailer";
import { genSaltSync, hashSync } from "bcrypt-ts";
import * as otpGenerator from "otp-generator";
import { returnHTMLEmail } from "../utils/welcomeHTML.js";
import type { Request, Response } from "express";

type reqObj = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
};
type userNameError = {
  firstName: boolean;
  lastName: boolean;
  totalLength: boolean;
};

type passwordError = {
  symbol: boolean;
  num: boolean;
  totalLength: boolean;
};

const verifyEmailHandler = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, email, password }: reqObj =
      req.body;

    const currentUserNameValidity: userNameError = checkUsernameValidity(
      firstName,
      middleName,
      lastName,
    );

    const currentEmailValidity: boolean = checkEmailValidity(email);

    const currentPasswordValidity: passwordError =
      checkPasswordValidity(password);

    if (
      currentUserNameValidity.firstName ||
      currentUserNameValidity.lastName ||
      currentUserNameValidity.totalLength ||
      currentEmailValidity ||
      currentPasswordValidity.totalLength ||
      currentPasswordValidity.num ||
      currentPasswordValidity.symbol
    ) {
      return res.status(400).json({
        success: false,
        error: {
          errDetails: {
            errMsg: "The form validation has incurred some error",
            errBody: {
              currentPasswordValidity: currentPasswordValidity,
              currentEmailValidity: currentEmailValidity,
              currentUserNameValidity: currentUserNameValidity,
            },
          },
        },
      });
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const otpVal = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await redisClient.hSet(email, {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      password: hashedPassword,
      otp: otpVal,
    });

    await redisClient.expire(email, 60 * 60);

    let userSession = await redisClient.hGetAll(email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: "LibSense",
      to: email,
      subject: "Your Libsense OTP",
      text: "hi",
      html: returnHTMLEmail(firstName, otpVal),
    });

    res.cookie("email", email, { maxAge: 60 * 60 * 1000, httpOnly: true });

    return res.status(200).json({
      success: true,
      successMsg: "verify the email",
      data: userSession,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.stack);
      return res.status(500).json({
        success: false,
        error: {
          errName: err.name,
          errMsg: err.message,
        },
      });
    }
  }
};

export { verifyEmailHandler };
