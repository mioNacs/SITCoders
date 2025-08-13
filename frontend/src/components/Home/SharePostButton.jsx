import React, { useState } from 'react';
import { FaShare } from 'react-icons/fa';
import SharePostModal from './SharePostModal';

const SharePostButton = ({ post, className = '' }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = (e) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleShareClick}
        className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-50 ${className}`}
        title="Share this post"
      >
        <FaShare size={14} />
        <span className="text-sm">Share</span>
      </button>

      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        post={post}
      />
    </>
  );
};

export default SharePostButton;
