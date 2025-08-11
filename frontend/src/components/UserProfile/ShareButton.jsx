import React, { useState } from 'react';
import { FaShare } from 'react-icons/fa';
import ShareProfileModal from './ShareProfileModal';

const ShareButton = ({ user, isOwnProfile, className = '' }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleShareClick}
        className={`flex items-center cursor-pointer gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md transform ${className}`}
        title={isOwnProfile ? 'Share your profile' : `Share ${user?.fullName}'s profile`}
      >
        <FaShare size={14} />
        <span className="font-medium">Share</span>
      </button>

      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        user={user}
        isOwnProfile={isOwnProfile}
      />
    </>
  );
};

export default ShareButton;