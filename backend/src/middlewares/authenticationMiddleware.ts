import dotenv from "dotenv";
dotenv.config();
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "node:util";
const jwtVerify = promisify(jwt.verify) as (
  accessToken: string,
  refreshToken: string,
) => Promise<jwt.JwtPayload>;

type cookieObjType = {
  accessToken?: string;
  refreshToken?: string;
};
const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let cookies = req.cookies as cookieObjType;

  if (!cookies)
    return res.status(403).json({
      success: false,
      errDetails: {
        errMsg: "missing cookies in the request header",
      },
    });

  const { accessToken, refreshToken } = cookies;
  try {
    const newError = new Error();
    newError.name = "TokenExpiredError";
    if (!accessToken) throw newError;

    const result = await jwtVerify(
      String(accessToken),
      String(process.env.ACCESS_TOKEN_SECRET),
    );

    console.log("from second in the middle ware ")
    console.log(result)

    const { id, email, firstName, lastName, middleName } = result;

    req.user = {
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
    };

    console.log("from the first in teh middleware ")
    console.log(req.user)

    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
        try {
          const newError = new Error();
          newError.name = "TokenExpiredError";
          if (!refreshToken) throw newError;
          const result = await jwtVerify(
            String(refreshToken),
            String(process.env.REFRESH_TOKEN_SECRET),
          );

          const { id, email, firstName, lastName, middleName } = result;

          const payload = {
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
          };

          const newAccessToken = jwt.sign(
            payload,
            String(process.env.ACCESS_TOKEN_SECRET),
            { expiresIn: "30m" },
          );
          const newRefreshToken = jwt.sign(
            payload,
            String(process.env.REFRESH_TOKEN_SECRET),
            { expiresIn: "30d" },
          );

          req.user = payload;

          res.cookie("accessToken", newAccessToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.cookie("refreshToken", newRefreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });

          next();
        } catch (error: unknown) {
          if (error instanceof Error) {
            return res.status(500).json({
              success: false,
              errMsg: error.message,
              errName: error.name,
            });
          }
        }
      } else {
        return res.status(500).json({
          success: false,
          errMsg: err.message,
          errName: err.name,
        });
      }
    }
  }
};
export { authenticationMiddleware };
