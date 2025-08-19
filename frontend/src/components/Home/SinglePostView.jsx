import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaSpinner, FaUser, FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import { getPostById, deletePost, editPost } from "../../services/postApi";
import { getComments } from "../../services/commentApi";
import { useAuth } from "../../context/AuthContext";
import { usePopularity } from "../../context/PopularityContext";
import CommentSection from "./CommentSection";
import SharePostButton from "./SharePostButton";
import PostPopularityButton from "./PostPopularityButton";
import { renderSafeMarkdown } from "../../utils/sanitize";
import PostMenu from "./PostMenu";
// Edit/Delete modals are centralized in PostUIContext
import { usePostUI } from "../../context/PostUIContext";
import { formatRelativeDate as formatDate } from "../../utils/formatters";

const SinglePostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { registerEditHandler, registerDeleteHandler } = usePostUI();
  const { initializePostPopularity } = usePopularity();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentLoading, _setCommentLoading] = useState(false);
  // Modals are centralized; no local state

  // Local tag style with slight variants preserved
  const getTagStyle = (tag) => {
    const tagColors = {
      general: "bg-blue-100 text-blue-800",
      query: "bg-green-100 text-green-800",
      announcement: "bg-yellow-100 text-yellow-800",
      event: "bg-purple-100 text-purple-800",
      project: "bg-red-100 text-red-800",
    };
    return tagColors[tag] || "bg-gray-100 text-gray-800";
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        navigate("/home");
        return;
      }

      try {
        setLoading(true);
        const postData = await getPostById(postId);
        setPost(postData.post);

        // Initialize popularity data for this post
        if (postData.post && user?._id) {
          initializePostPopularity(postData.post._id, postData.post.popularity, user._id);
        }

        // Fetch comments for this post
        const commentsData = await getComments(postId);
        setComments({ [postId]: commentsData.parentComment || [] });
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      fetchPost();
    }
  }, [postId, navigate, isAuthenticated, authLoading, user?._id, initializePostPopularity]);

  // Register handlers for centralized modals
  useEffect(() => {
    const unregisterEdit = registerEditHandler(async (postId, data) => {
      try {
        const res = await editPost(postId, data);
        const updated = res.post || res.updatedPost || {};
        setPost((prev) => {
          if (!prev) return updated;
          const next = { ...prev, ...updated };
          const ua = updated.author;
          const incomplete = !ua || typeof ua !== 'object' || !ua.fullName;
          if (incomplete) next.author = prev.author;
          return next;
        });
        toast.success(res.message || 'Post updated');
        return { success: true };
      } catch (e) {
        toast.error(e.message || 'Failed to update post');
        return { success: false, message: e.message };
      }
    });

    const unregisterDelete = registerDeleteHandler(async (id) => {
      try {
        const res = await deletePost(id);
        toast.success(res.message || 'Post deleted');
        navigate('/home');
      } catch (e) {
        toast.error(e.message || 'Failed to delete post');
      }
    });

    return () => {
      unregisterEdit();
      unregisterDelete();
    };
  }, [registerEditHandler, registerDeleteHandler, navigate]);

  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-orange-500" size={32} />
          <span className="mt-4 text-gray-600">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Post not found
          </h2>
          <Link
            to="/home"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const content = (
    <div className="post-container pt-20 min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto md:pb-4">
        {/* Post Card */}
        <div className="post-card bg-white md:rounded-xl shadow-md border border-orange-100">
          <div className="overflow-visible rounded-t-xl">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link
                  to={`/profile/${post.author.username}`}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {post.author?.profilePicture?.url ? (
                    <img
                      src={post.author.profilePicture.url}
                      alt={post.author.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author?.fullName?.charAt(0) || <FaUser />}
                    </div>
                  )}
                </Link>
                <div>
                  <Link
                    to={`/profile/${post.author?.username}`}
                    className="font-semibold text-gray-800 hover:!text-orange-600 transition-colors"
                  >
                    {post.author?.fullName || "Unknown User"}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                    {post.beenEdited && (
                      <span className="ml-2 text-orange-500">(edited)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                {post.tag && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTagStyle(
                      post.tag
                    )}`}
                  >
                    {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
                  </span>
                )}
                <PostMenu post={post} />
                <SharePostButton post={post} />
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-gray max-w-none">
              <div
                className="markdown-body text-gray-800 break-words"
                dangerouslySetInnerHTML={{
                  __html: renderSafeMarkdown(post.content),
                }}
              />
            </div>

            {/* Post Image */}
            {post.postImage?.url && (
              <div className="mt-4">
                <img
                  src={post.postImage.url}
                  alt="Post"
                  className="w-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <PostPopularityButton 
                postId={post._id} 
                size="default"
                showCount={true}
              />
              <div className="flex items-center gap-2 text-gray-500">
                <FaComments size={16} />
                <span className="text-sm">
                  {comments[post._id]?.length || 0} Comments
                </span>
              </div>
            </div>
          </div>
          
          {/* close overflow wrapper */}
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-500">
            <CommentSection
              postId={post._id}
              comments={comments}
              setComments={setComments}
              commentLoading={commentLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {content}
  {/* Edit/Delete modals are rendered by PostUIProvider */}
    </>
  );
};

export default SinglePostView;
