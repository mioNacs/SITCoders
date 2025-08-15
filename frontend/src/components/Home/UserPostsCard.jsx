import React from 'react';
import { FaClipboard } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const UserPostsCard = ({ user, userPostsCount, onCreatePost }) => {
  const {isSuspended} = useAuth();
  return (
    <div className="bg-white rounded-2xl  border border-orange-100 p-6">
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
          className="mt-4 w-full border border-orange-300 text-orange-500 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all"
        >
          Create New Post
        </button>
      )}
    </div>
  );
};

export default UserPostsCard;