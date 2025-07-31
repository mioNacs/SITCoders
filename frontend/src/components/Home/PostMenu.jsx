import React from 'react';
import { FaEllipsisV, FaTrash, FaEdit } from 'react-icons/fa';

const PostMenu = ({ 
  post, 
  showPostMenu, 
  setShowPostMenu, 
  onDeleteConfirm,
  onEditPost,
  canEditPost,
  canDeletePost 
}) => {
  // Show menu if user can either edit or delete
  if (!canDeletePost(post) && !canEditPost(post)) return null;

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
          {/* Edit Button - Only show if user can edit */}
          {canEditPost(post) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPost(post);
                setShowPostMenu(null);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors text-sm"
            >
              <FaEdit size={12} />
              <span>Edit</span>
            </button>
          )}
          
          {/* Delete Button - Only show if user can delete */}
          {canDeletePost(post) && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default PostMenu;