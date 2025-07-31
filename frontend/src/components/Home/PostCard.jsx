import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import PostMenu from './PostMenu';
import PostActions from './PostActions';

const PostCard = ({ 
  post, 
  comments, 
  showPostMenu, 
  setShowPostMenu,
  onDeleteConfirm,
  onEditPost,
  canEditPost,
  onShowComments,
  canDeletePost,
  formatDate,
  getTagStyle 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 transition-colors">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        {post.author?.profilePicture?.url ? (
          <img
            src={post.author.profilePicture.url}
            alt="Author"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-400" />
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">
            {post.author?.fullName || post.author?.username || "Unknown User"}
            {post.beenEdited && (
              <span className="text-xs text-gray-500 ml-1">(Edited)</span>)}
          </h4>
          <p className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </p>
        </div>
        {post.tag !== "general" && (
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getTagStyle(post.tag)}`}
          >
            {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
          </span>
        )}

        <PostMenu
          post={post}
          showPostMenu={showPostMenu}
          setShowPostMenu={setShowPostMenu}
          onDeleteConfirm={onDeleteConfirm}
          onEditPost={onEditPost}
          canEditPost={canEditPost}
          canDeletePost={canDeletePost}
        />
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-3">{post.content}</p>

      {/* Post Image */}
      {post.postImage?.url && (
        <img
          src={post.postImage.url}
          alt="Post"
          className="w-full object-cover rounded-lg mb-3"
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