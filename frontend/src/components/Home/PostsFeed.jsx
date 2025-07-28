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
  onShowComments,
  canDeletePost,
  formatDate,
  getTagStyle 
}) => {
  return (
    <div className="bg-white md:rounded-2xl shadow-md border border-orange-100 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 border-orange-100 mb-4">
        Feed
      </h2>

      {postsLoading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-orange-500" size={24} />
          <span className="ml-2 text-gray-600">Loading posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <FaClipboard className="mx-auto mb-4 text-gray-400" size={48} />
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              comments={comments}
              showPostMenu={showPostMenu}
              setShowPostMenu={setShowPostMenu}
              onDeleteConfirm={onDeleteConfirm}
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