import React from 'react';
import { FaShare } from 'react-icons/fa';

const ShareResourceButton = ({ resource, onShare, className = '' }) => {

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare(resource);
  };

  return (
    <>
      <button
        onClick={handleShareClick}
        className={`flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors ${className}`}
        title="Share this resource"
      >
        <FaShare size={14} />
        <span className="text-sm">Share</span>
      </button>
    </>
  );
};

export default ShareResourceButton;