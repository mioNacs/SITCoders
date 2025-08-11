import React from 'react';
import { FaSpinner, FaClipboard } from 'react-icons/fa';
import PostCard from './PostCard';

const PostsFeed = ({ 
  posts, 
  postsLoading, 
  comments,
  showPostMenu, 
  setShowPostMenu,
  onDeleteConfirm,
  onEditPost,
  onShowComments,
  canDeletePost,
  canEditPost,
  formatDate,
  getTagStyle 
}) => {
  return (
    <div className="pt-4 border-t border-gray-400">
      {postsLoading ? (
        <div className="flex justify-center items-center py-6">
          <FaSpinner className="animate-spin text-orange-500" size={24} />
          <span className="ml-2 text-gray-600">Loading posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <FaClipboard className="mx-auto mb-4 text-gray-400" size={48} />
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              comments={comments}
              showPostMenu={showPostMenu}
              setShowPostMenu={setShowPostMenu}
              onDeleteConfirm={onDeleteConfirm}
              onEditPost={onEditPost}
              canEditPost={canEditPost}
              onShowComments={onShowComments}
              canDeletePost={canDeletePost}
              formatDate={formatDate}
              getTagStyle={getTagStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsFeed;