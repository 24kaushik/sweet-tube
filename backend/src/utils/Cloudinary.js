import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudiary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //Upload the file on cloudinary.
    const response = await cloudinary.uploader
      .upload(localFilePath, { resource_type: "auto" })
      .then((result) => {
        console.log("File uploaded successfully", result);
      });
      return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //Remove the locally saved temporary file if upload fails.
    return null;
  }
};

cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
