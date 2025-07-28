import React from 'react';
import { FaPlus } from 'react-icons/fa';

const CreatePostButton = ({ user, onCreatePost }) => {
  return (
    <div className="bg-white md:rounded-2xl shadow-md border border-orange-100 p-4">
      <button
        disabled={!user.isAdminVerified}
        onClick={onCreatePost}
        className="w-full flex items-center gap-3 p-4 text-black/50 bg-orange-400/10 outline outline-offset-2 outline-orange-400 rounded-lg font-medium hover:opacity-90 transition-all cursor-text disabled:bg-red-100 disabled:text-red-700"
      >
        {user.isAdminVerified ? (
          <>  
            <FaPlus />
            <span>What's on your mind, {user?.username || user?.fullName || "User"}?</span>
          </>  
        ) : (
          <span>ASK AN ADMIN TO VERIFY YOU!!</span>
        )}
      </button>
    </div>
  );
};

export default CreatePostButton;