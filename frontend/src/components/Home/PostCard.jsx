import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import PostMenu from "./PostMenu";
import PostActions from "./PostActions";
import { renderSafeMarkdown } from "../../utils/sanitize";
import {
  formatRelativeDate as formatDate,
  getTagStyle,
} from "../../utils/formatters";

const PostCard = ({ post, comments, onShowComments }) => {
  return (
    <div className="post-card border bg-white border-gray-200 md:rounded-lg p-4 hover:border-orange-200 md:shadow-md transition-colors">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <Link
          to={`/profile/${post.author.username}`}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {post.author?.profilePicture?.url ? (
            <img
              src={post.author.profilePicture.url}
              alt="Author"
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-400" />
          )}
        </Link>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">
            <Link
              to={`/profile/${post.author.username}`}
              className="font-semibold text-gray-800 hover:!text-orange-600 transition-colors"
            >
              {post.author?.fullName}
            </Link>
            {post.beenEdited && (
              <span className="text-xs text-gray-500 ml-1">(Edited)</span>
            )}
          </h4>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
        {post.tag !== "general" && (
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getTagStyle(
              post.tag
            )}`}
          >
            {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
          </span>
        )}

        <PostMenu post={post} />
      </div>

      {/* Post Content */}
      <div
        className="markdown-body text-gray-700 pb-3 break-words"
        dangerouslySetInnerHTML={{
          __html: renderSafeMarkdown(post.content),
        }}
      />

      {/* Post Image */}
      {post.postImage?.url && (
        <img
          src={post.postImage.url}
          alt="Post"
          className="w-full object-cover rounded-lg mb-3"
          loading="lazy"
          decoding="async"
        />
      )}

      <PostActions
        post={post}
        comments={comments}
        onShowComments={onShowComments}
      />
    </div>
  );
};

export default PostCard;
