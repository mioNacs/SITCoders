import React from 'react';

const PostsSection = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-orange-100 p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4 border-b border-orange-200 pb-2">
        Your Posts
      </h2>
      <div className="flex items-center justify-center h-64 text-gray-400">
        No posts yet
      </div>
    </div>
  );
};

export default PostsSection;