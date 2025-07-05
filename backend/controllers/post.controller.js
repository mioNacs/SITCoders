import Post from "../models/post.model.js";
import {  uploadPostImageOnCloudinary } from "../middlewares/cloudinary.js";
import fs from "fs";
const createPost = async (req, res) => {
  try {
    const { content, tag } = req.body;
    const author = req.user._id; // Assuming user ID is stored in req.user

    if(!content || !author) {
      return res.status(400).json({ message: "Content and author are required." });
    }

    const file = req.file;
    let imageUrl = null;
    let imagePublicId = null;
    if (file) {
      // Handle file upload
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.mimetype)) {
        if (file.path) {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error("Error deleting temporary file:", error);
          }
        }

        return res
          .status(400)
          .json({
            message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
          });
      }

      try {
        const uploadResult = await uploadPostImageOnCloudinary(file.path);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;

        // Delete the temporary file after uploading
        fs.unlinkSync(file.path);

        if (!imageUrl || !imagePublicId) {
          return res
            .status(500)
            .json({ message: "Failed to upload image to Cloudinary." });
        }
      } catch (uploadError) {
        if (file.path) {
          try {
            await unlinkAsync(file.path);
          } catch (cleanupError) {
            console.error(
              "Error cleaning up file after upload failure:",
              cleanupError
            );
          }
        }
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }
    // Create the post
    const newPost = await Post.create({
        content,
        author,
        postImage: {
          url: imageUrl,
          public_id: imagePublicId,
        },
        tag: tag || "general", // Default to 'general' if no tag is provided
      });
    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createPost };
