import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No filepath provided for upload");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'sitverse/profiles',
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error?.message || "Failed to upload file to Cloudinary");
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error("No public_id provided for deletion");
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'auto',
    });

    return result;

  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error(error?.message || "Failed to delete file from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };