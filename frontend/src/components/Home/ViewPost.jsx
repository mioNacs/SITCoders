import {useEffect} from "react";
import { FaTimes, FaComments, FaUser } from "react-icons/fa";
import CommentSection from "./CommentSection";
import PostPopularityButton from "./PostPopularityButton";
import { useAuth } from "../../context/AuthContext";
import { usePopularity } from "../../context/PopularityContext";
import { renderSafeMarkdown } from "../../utils/sanitize";
import { Link } from "react-router-dom";
import { formatRelativeDate as formatDate } from "../../utils/formatters";
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock';

function ViewPost({
  posts,
  comments,
  setShowComments,
  setComments,
  commentLoading,
  showComments,
}) {
  const { user } = useAuth();
  const { initializePostPopularity } = usePopularity();
  
  // Find the current post
  const currentPost = posts.find((post) => post._id === showComments);

  // Initialize popularity data for the current post
  useEffect(() => {
    if (currentPost && user?._id) {
      initializePostPopularity(currentPost._id, currentPost.popularity, user._id);
    }
  }, [currentPost, user?._id, initializePostPopularity]);

  if (!currentPost) {
    return null;
  }

  // Lock body while the comments modal is mounted
  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
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
              className="cursor-pointer hover:opacity-80 transition-opacity"
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
            <PostPopularityButton 
              postId={currentPost._id} 
              size="default"
              showCount={true}
            />
            <div className="flex items-center gap-2 text-gray-500">
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
          onNavigate={() => setShowComments(null)}
        />
      </div>
    </div>
  );
}

export default ViewPost;
