import Post from "../models/post.model.js";
import {  uploadPostImageOnCloudinary,deleteFromCloudinary } from "../middlewares/cloudinary.js";
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
        imageUrl = uploadResult.url;
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

const deletePost = async (req, res) => {
  const session = await Post.startSession();
  session.startTransaction();

  try {
    const postId = req.params.id;
    const authorId = req.user._id;

    if (!postId || !authorId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Post ID and Author ID are required." });
    }

    const post = await Post.findOne({ _id: postId, author: authorId }).session(session);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found or unauthorized." });
    }

    const imagePublicId = post.postImage?.public_id;

    // Step 1: Delete image from Cloudinary
    if (imagePublicId) {
      const deleteResult = await deleteFromCloudinary(imagePublicId);
      if (!deleteResult || deleteResult.result !== "ok") {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Failed to delete image from Cloudinary." });
      }
    }

    // Step 2: Delete Post using session
    await Post.deleteOne({ _id: postId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Post deleted successfully." });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }finally {
    if (session) {
      session.endSession();
    }
  }
};

const getALLPosts = async (req,res) => {
  try {
    // Default values if not provided
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;

    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const posts = await Post.find()
      .populate("author", "name profilePicture") // Populate author details
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    // Count total posts for pagination
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
    
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
};



export { createPost, deletePost,getALLPosts };
