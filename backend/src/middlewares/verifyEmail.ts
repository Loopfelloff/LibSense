import { redisClient } from "../config/redisConfiguration.js";
import {
  checkUsernameValidity,
  checkEmailValidity,
  checkPasswordValidity,
} from "../utils/formValidation.js";
import nodemailer from "nodemailer";
import * as otpGenerator from "otp-generator";
import type { Request, Response, NextFunction } from "express";

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

    const otpVal = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await redisClient.hSet(otpVal, {
      email: email,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      password: password,
    });

    let userSession = await redisClient.hGetAll(otpVal);

    return res.status(200).json({
      success: true,
      data: userSession,
    });
  } catch (err) {
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
  } finally {
    await redisClient.disconnect();
  }
};
