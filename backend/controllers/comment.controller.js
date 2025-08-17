import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import mongoose, { mongo } from "mongoose";

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim() || typeof content !== "string") {
      return res
        .status(400)
        .json({ message: "Content is required and must be a string." });
    }
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post ID and User ID are required." });
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Create the comment
    const newComment = await Comment.create({
      content: content.trim(),
      post: postId,
      user: userId,
      parentComment: null, // Assuming this is a top-level comment
    });

    // Populate user details
    const populatedComment = await Comment.findById(newComment._id)
      .select("-__v")
      .populate("user", "fullName username profilePicture");

    res
      .status(201)
      .json({
        message: "Comment created successfully",
        comment: populatedComment,
      });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const trimedContent = content?.trim();
    if (!trimedContent || typeof trimedContent !== "string") {
      return res
        .status(400)
        .json({ message: "Content is required and must be a string." });
    }
    const commentId = req.params.commentId;
    const userId = req.user._id;
    if (!commentId || !userId) {
      return res
        .status(400)
        .json({ message: "Comment ID and User ID are required." });
    }
    // Check if the comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    // Create the reply
    const newReply = await Comment.create({
      content: trimedContent,
      post: parentComment.post,
      user: userId,
      parentComment: commentId,
    });

    // Populate user details
    const populatedReply = await Comment.findById(newReply._id)
      .select("-__v")
      .populate("user", "fullName username profilePicture");

    res
      .status(201)
      .json({ message: "Reply created successfully", comment: populatedReply });
  } catch (error) {
    console.error("Error creating reply:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getParentComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    // Fetch parent comments for the given post
    const parentComments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .select("-__v")
      .populate("user", "fullName username profilePicture")
      .sort({ createdAt: -1 });

    // Fetch replies for each parent comment
    const commentsWithReplies = await Promise.all(
      parentComments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
        })
          .select("-__v")
          .populate("user", "fullName username profilePicture")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies: replies,
        };
      })
    );

    if (!commentsWithReplies || commentsWithReplies.length === 0) {
      return res
        .status(200)
        .json({ message: "No comments found.", parentComment: [] });
    }

    res.status(200).json({ parentComment: commentsWithReplies });
  } catch (error) {
    console.error("Error fetching parent comment:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (!comment.user.equals(user._id)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments." });
    }

    const repliesDeleted = await Comment.deleteMany({
      parentComment: comment._id,
    });
    await Comment.deleteOne({ _id: comment._id });

    res.status(200).json({
      message: "Comment and replies deleted successfully.",
      repliesDeleted: repliesDeleted.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }

    if (!content?.trim() || typeof content !== "string") {
      return res.status(400).json({ message: "Content is required and must be a string." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Only the author can edit their comment
    if (!comment.user.equals(user._id)) {
      return res.status(403).json({ message: "You can only edit your own comments." });
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: content.trim() },
      { new: true }
    )
      .select("-__v")
      .populate("user", "fullName username profilePicture");

    res.status(200).json({
      message: "Comment updated successfully.",
      comment: updatedComment
    });
  } catch (error) {
    console.error("Error updating comment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Admin can delete any comment (no ownership check)
    const repliesDeleted = await Comment.deleteMany({ parentComment: comment._id });
    await Comment.deleteOne({ _id: comment._id });

    res.status(200).json({
      message: "Comment and replies deleted successfully by admin.",
      repliesDeleted: repliesDeleted.deletedCount
    });
  } catch (error) {
    console.error("Error deleting comment (admin):", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createComment, createReply, getParentComment, deleteComment, updateComment, adminDeleteComment };