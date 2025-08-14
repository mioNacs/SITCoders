import React, { useState } from 'react';
import { FiShare2 } from 'react-icons/fi';
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
        className={`flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-sm hover:bg-white/30 transition-all duration-200 border border-white/20 cursor-pointer ${className}`}
        title={isOwnProfile ? 'Share your profile' : `Share ${user?.fullName}'s profile`}
      >
        <FiShare2 size={24} />
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