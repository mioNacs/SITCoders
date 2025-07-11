import React, { useState, useEffect } from "react";
import { createComment, createReply } from "../../services/commentApi";
import {
  FaTimes,
  FaUser,
  FaSpinner,
  FaPaperPlane,
  FaReply,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function ViewPost({
  posts,
  comments,
  setShowComments,
  setComments,
  setCommentLoading,
  commentLoading,
  showComments,
}) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState({});

  // Find the current post
  const currentPost = posts.find((post) => post._id === showComments);
  const postComments = comments[showComments] || [];

  // Format date function
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createComment(showComments, newComment);

      if (result.success) {
        // Update comments state
        setComments((prev) => ({
          ...prev,
          [showComments]: [...(prev[showComments] || []), result.comment],
        }));

        setNewComment("");
        toast.success("Comment added successfully!");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reply submission
  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.warning("Please enter a reply");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createReply(replyTo, replyContent);

      if (result.success) {
        // Update comments state with new reply
        setComments((prev) => {
          const updatedComments = [...(prev[showComments] || [])];
          const commentIndex = updatedComments.findIndex(
            (c) => c._id === replyTo
          );
          if (commentIndex !== -1) {
            updatedComments[commentIndex] = {
              ...updatedComments[commentIndex],
              replies: [
                ...(updatedComments[commentIndex].replies || []),
                result.reply,
              ],
            };
          }
          return {
            ...prev,
            [showComments]: updatedComments,
          };
        });

        setReplyContent("");
        setReplyTo(null);
        toast.success("Reply added successfully!");
      } else {
        toast.error("Failed to add reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to add reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!currentPost) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Post Comments</h3>
        <button
          onClick={() => setShowComments(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            {currentPost.author?.profilePicture?.url ? (
              <img
                src={currentPost.author.profilePicture.url}
                alt="Author"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUser className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-2" />
            )}
            <div>
              <h4 className="font-semibold text-gray-800">
                {currentPost.author?.fullName ||
                  currentPost.author?.username ||
                  "Unknown User"}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(currentPost.createdAt)}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{currentPost.content}</p>
          {currentPost.postImage?.url && (
            <img
              src={currentPost.postImage.url}
              alt="Post"
              className="w-full max-w-md object-cover rounded-lg"
            />
          )}
        </div>

        {/* Comments Section */}
        <div className="flex-1 p-6">
          {commentLoading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-orange-500" size={24} />
              <span className="ml-2 text-gray-600">Loading comments...</span>
            </div>
          ) : postComments.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {postComments.map((comment) => (
                <div
                  key={comment._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {comment.author?.profilePicture?.url ? (
                      <img
                        src={comment.author.profilePicture.url}
                        alt="Commenter"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                    )}
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {comment.author?.fullName ||
                          comment.author?.username ||
                          "Unknown User"}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>

                  {/* Reply button */}
                  <button
                    onClick={() =>
                      setReplyTo(replyTo === comment._id ? null : comment._id)
                    }
                    className="text-orange-500 text-sm hover:text-orange-600 transition-colors flex items-center gap-1"
                  >
                    <FaReply size={12} />
                    <span>Reply</span>
                  </button>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
                      >
                        {showReplies[comment._id] ? "Hide" : "Show"}{" "}
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </button>

                      {showReplies[comment._id] && (
                        <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply._id}
                              className="bg-gray-50 rounded p-3"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {reply.author?.profilePicture?.url ? (
                                  <img
                                    src={reply.author.profilePicture.url}
                                    alt="Replier"
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <FaUser className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />
                                )}
                                <h6 className="font-medium text-gray-800 text-sm">
                                  {reply.author?.fullName ||
                                    reply.author?.username ||
                                    "Unknown User"}
                                </h6>
                                <p className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </p>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reply form */}
                  {replyTo === comment._id && (
                    <form onSubmit={handleSubmitReply} className="mt-3 ml-6">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none text-sm"
                          disabled={submitting}
                        />
                        <button
                          type="submit"
                          disabled={submitting || !replyContent.trim()}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {submitting ? (
                            <FaSpinner className="animate-spin" size={12} />
                          ) : (
                            <FaPaperPlane size={12} />
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <div className="flex items-center gap-3 flex-1">
            {user?.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt="Your profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUser className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1" />
            )}
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user.isAdminVerified? "Write a comment..." : "You must be verified by an admin to comment."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none"
              disabled={submitting || !user.isAdminVerified}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <FaSpinner className="animate-spin" size={16} />
            ) : (
              <FaPaperPlane size={16} />
            )}
            <span className="hidden sm:inline">Comment</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ViewPost;
