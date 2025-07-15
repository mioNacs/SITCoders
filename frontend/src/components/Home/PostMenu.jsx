import React from 'react';
import { FaEllipsisV, FaTrash } from 'react-icons/fa';

const PostMenu = ({ 
  post, 
  showPostMenu, 
  setShowPostMenu, 
  onDeleteConfirm,
  canDeletePost 
}) => {
  if (!canDeletePost(post)) return null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPostMenu(showPostMenu === post._id ? null : post._id);
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <FaEllipsisV className="text-gray-500" size={14} />
      </button>

      {showPostMenu === post._id && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConfirm(post._id);
              setShowPostMenu(null);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm"
          >
            <FaTrash size={12} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMenu;