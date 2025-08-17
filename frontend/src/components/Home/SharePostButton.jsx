import React from 'react';
import { FaShare } from 'react-icons/fa';
import { usePostUI } from '../../context/PostUIContext';

const SharePostButton = ({ post, className = '' }) => {
  const { requestShare } = usePostUI();

  const handleShareClick = (e) => {
    e.stopPropagation();
  requestShare(post);
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

  {/* Share modal is centralized in PostUIProvider */}
    </>
  );
};

export default SharePostButton;
