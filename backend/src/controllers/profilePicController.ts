import type { Request, Response } from "express";
import { cloudinary, uploadToCloudinary } from "../config/cloudinaryConfig.js";
import { prisma } from "../config/prismaClientConfig.js";

const postProfilePicController = async (req: Request, res: Response) => {
  try {
    const userId = "403d1a57-d529-45db-a6d6-38f4204e2b8b";
    if (!req.files) {
      return res.status(400).json({
        success: false,
        error: {
          errName: "ValidationError",
          errMsg: "No profile picture uploaded",
        },
      });
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file = files.profilePic[0];

    if (!file) {
      return res.status(400).json({
        success: false,
        error: {
          errName: "ValidationError",
          errMsg: "Profile picture file is missing",
        },
      });
    }
    const result = await uploadToCloudinary(file.buffer, {
      folder: "Libsense",
      resource_type: "auto",
    });

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile_pic_link: result.secure_url,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
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

export { postProfilePicController };
