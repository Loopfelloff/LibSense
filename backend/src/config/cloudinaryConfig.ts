import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (
  buffer: Buffer,
  options = {},
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "LibSense",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResult);
      },
    );
    stream.pipe(uploadStream);
  });
};
export { cloudinary, uploadToCloudinary };
