import Post from "../models/post.model.js";
import Admin from "../models/admin.model.js"; // Import Admin model
import User from "../models/user.model.js"; // Import User model
import Comment from "../models/comment.model.js";
import { uploadPostImageOnCloudinary, deleteFromCloudinary } from "../middlewares/cloudinary.js";
import fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

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
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!postId || !userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Post ID and User ID are required." });
    }

    // Check if user is an admin by looking in the Admin collection
    const adminRecord = await Admin.findOne({ admin: userId });
    const isAdmin = adminRecord !== null;

    // Find the post (not filtered by author initially)
    const post = await Post.findById(postId).session(session);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found." });
    }

    // Check permissions: user is the author OR user is an admin
    const isAuthor = post.author.toString() === userId.toString();

    //also delete all the comment has been commendted on the post
    await Comment.deleteMany({ post: postId }).session(session);

    if (!isAuthor && !isAdmin) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        message: "Unauthorized. You can only delete your own posts or you must be an admin."
      });
    }

    const imagePublicId = post.postImage?.public_id;

    // Step 1: Delete image from Cloudinary if exists
    if (imagePublicId) {
      try {
        const deleteResult = await deleteFromCloudinary(imagePublicId);
        if (!deleteResult || deleteResult.result !== "ok") {
          console.warn("Failed to delete image from Cloudinary, but continuing with post deletion");
        }
      } catch (cloudinaryError) {
        console.warn("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Step 2: Delete Post using session
    await Post.deleteOne({ _id: postId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Post deleted successfully.",
      deletedBy: isAdmin && !isAuthor ? "admin" : "author"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const getALLPosts = async (req, res) => {
  try {
    // Default values if not provided
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const tag = (req.query.tag || "").toString().trim().toLowerCase();

    const skip = (page - 1) * limit;

    // Build query with optional tag filter
    const findQuery = {};
    const allowedTags = ["general", "query", "announcement", "event", "project"];
    if (tag && allowedTags.includes(tag)) {
      findQuery.tag = tag;
    }

    // Fetch posts with pagination
    const posts = await Post.find(findQuery)
      .populate("author", "fullName username rollNo profilePicture") // Fixed field name
      .populate("commentCount") // populate virtual count
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    // Count total posts for pagination
    const totalPosts = await Post.countDocuments(findQuery);
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
      totalPosts,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages,
      },
    });

  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getALLPostsOfUser = async (req,res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in req.user
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const page = parseInt(req.query.page) || 1; // Default page number
    const tag = (req.query.tag || "").toString().trim().toLowerCase();
    const skip = (page - 1) * limit;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const findQuery = { author: userId };
    const allowedTags = ["general", "query", "announcement", "event", "project"];
    if (tag && allowedTags.includes(tag)) {
      findQuery.tag = tag;
    }

    const posts = await Post.find(findQuery)
      .populate("author", "fullName username rollNo profilePicture")
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);
    // Count total posts for pagination
    const totalPosts = await Post.countDocuments(findQuery);
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    res.status(200).json({
      message: "User's posts fetched successfully",
      posts,
      totalPosts,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages,
      },
    });

  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}
const editPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content, tag } = req.body;
    const userId = req.user._id;

    if (!postId || !content?.trim() || !userId) {
      return res.status(400).json({ message: "Post ID, content, and user ID are required." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only edit your own posts." });
    }

    post.content = content.trim();
    post.tag = tag || post.tag;
    post.beenEdited = true;

    const file = req.file;
    if (file) {
      if (post.postImage && post.postImage.public_id) {
        await deleteFromCloudinary(post.postImage.public_id);
      }
      const uploadResult = await uploadPostImageOnCloudinary(file.path);
      post.postImage = {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      };
      fs.unlinkSync(file.path);
    }

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Add this controller function
const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posts
    const posts = await Post.find({ author: userId })
      .populate("author", "fullName username profilePicture rollNo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({ author: userId });
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add this controller function
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Find the post by ID and populate author and virtual commentCount
    const post = await Post.findById(postId)
      .populate("author", "fullName username profilePicture rollNo")
      .populate("commentCount");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createPost, deletePost, getALLPosts, getALLPostsOfUser, editPost, getPostsByUserId, getPostById };
