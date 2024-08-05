import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //Upload the file on cloudinary.
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); //Remove the locally saved temporary file.

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //Remove the locally saved temporary file if upload fails.
    return null;
  }
};

const deleteFromCloudinary = async (url) => {
  try {
    if (typeof url !== "string") {
      return false;
    }

    const publicId = url.split("/").at(-1).split(".")[0];
    const response = await cloudinary.uploader.destroy(publicId);

    if (response?.result !== "ok") {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
