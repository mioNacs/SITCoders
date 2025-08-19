import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usePopularity } from '../../context/PopularityContext';
import { toast } from 'react-toastify';

const CommentPopularityButton = ({ 
  commentId, 
  className = "",
  size = "small" // "small", "default", "large"
}) => {
  const { user, isAuthenticated } = useAuth();
  const { 
    toggleCommentPopularity, 
    isCommentLiked, 
    getCommentPopularityCount 
  } = usePopularity();

  const isLiked = isCommentLiked(commentId);
  const count = getCommentPopularityCount(commentId);

  // Size variants
  const sizeClasses = {
    small: {
      button: "text-xs p-1 px-2",
      icon: "text-xs",
      gap: "gap-1"
    },
    default: {
      button: "text-sm p-1.5 px-3",
      icon: "text-sm",
      gap: "gap-1.5"
    },
    large: {
      button: "text-base p-2 px-4",
      icon: "text-base",
      gap: "gap-2"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.small;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like comments');
      return;
    }

    if (!user?._id) {
      toast.error('User information not available');
      return;
    }

    toggleCommentPopularity(commentId, user._id);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isAuthenticated}
      className={`
        flex items-center ${currentSize.gap} ${currentSize.button}
        rounded-lg transition-all duration-200 hover:bg-gray-100
        ${isLiked 
          ? 'text-orange-600 hover:bg-orange-50' 
          : 'text-gray-500 hover:text-orange-500'
        }
        ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isAuthenticated ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
    >
      {isLiked ? (
        <FaStar className={`${currentSize.icon} text-orange-500`} />
      ) : (
        <FaRegStar className={currentSize.icon} />
      )}
      {count > 0 && (
        <span className="font-medium">
          {count}
        </span>
      )}
    </button>
  );
};

export default CommentPopularityButton;
