import React from 'react';
import { FaPen } from 'react-icons/fa';

const ProfileHeader = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-orange-400 to-orange-500 h-48 rounded-t-lg">
      <button className="absolute right-4 bottom-4 flex gap-2 items-center bg-white text-orange-500 px-3 py-2 rounded-md shadow-sm hover:bg-orange-50 transition-colors">
        <FaPen size={14} />
        <span className="font-medium">Edit profile</span>
      </button>
    </div>
  );
};

export default ProfileHeader;