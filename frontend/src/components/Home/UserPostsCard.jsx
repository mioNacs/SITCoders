import React from 'react';
import { FaClipboard } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const UserPostsCard = ({ user, userPostsCount, onCreatePost }) => {
  const {isSuspended} = useAuth();
  return (
    <div className="bg-white rounded-2xl  border border-orange-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaClipboard className="text-amber-500" />
        <h3 className="text-xl font-semibold text-gray-800">
          Your Posts
        </h3>
      </div>
      <div className="text-gray-600 text-sm">
        {user
          ? `You have ${userPostsCount} post${userPostsCount === 1 ? '' : 's'}`
          : "You haven't created any posts yet."}
      </div>
      {user.isAdminVerified && !isSuspended && (
        <button
          onClick={onCreatePost}
          className="mt-4 w-full border bg-orange-100 hover:bg-orange-200 text-orange-600 py-2 rounded-lg font-medium transition-all cursor-pointer"
        >
          Create New Post
        </button>
      )}
    </div>
  );
};

export default UserPostsCard;