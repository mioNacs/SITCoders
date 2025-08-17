import React from "react";
import { FaTimes, FaComments, FaUser } from "react-icons/fa";
import CommentSection from "./CommentSection";
import { renderSafeMarkdown } from "../../utils/sanitize";
import { Link } from "react-router-dom";

function ViewPost({
  posts,
  comments,
  setShowComments,
  setComments,
  setCommentLoading,
  commentLoading,
  showComments,
}) {
  // Find the current post
  const currentPost = posts.find((post) => post._id === showComments);

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

  // Format content for display with rich text support
  const formatContentForDisplay = (content) => {
    if (!content) return "";

    return renderSafeMarkdown(content);
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
      <div className="relative overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to={`/profile/${currentPost.author.username}`}
              className="cursor-pointer"
            >
              {currentPost.author?.profilePicture?.url ? (
                <img
                  src={currentPost.author.profilePicture.url}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-2" />
              )}
            </Link>
            <div>
              <h4 className="font-semibold text-gray-800">
                <Link
                  to={`/profile/${currentPost.author.username}`}
                  className="font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                >
                  {currentPost.author?.fullName ||
                    currentPost.author?.username ||
                    "Unknown User"}
                </Link>
                {currentPost.beenEdited && (
                  <span className="text-xs text-gray-500 ml-1">(Edited)</span>
                )}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(currentPost.createdAt)}
              </p>
            </div>
          </div>

          {/* Post Content with Rich Text Support */}
          <div
            className="markdown-body text-gray-700 mb-3 break-words"
            dangerouslySetInnerHTML={{
              __html: renderSafeMarkdown(currentPost.content),
            }}
          />

          {currentPost.postImage?.url && (
            <img
              src={currentPost.postImage.url}
              alt="Post"
              className="w-full max-w-md object-cover rounded-lg"
            />
          )}
          {/* Post Stats */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <FaComments size={16} />
              <span className="text-sm">
                {comments[currentPost._id]?.length || 0} Comments
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section - Now using the extracted component */}
        <CommentSection
          postId={showComments}
          comments={comments}
          setComments={setComments}
          commentLoading={commentLoading}
        />
      </div>
    </div>
  );
}

export default ViewPost;
