import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usePopularity } from '../../context/PopularityContext';
import { toast } from 'react-toastify';

const PostPopularityButton = ({ 
  postId, 
  className = "",
  showCount = true,
  size = "default" // "small", "default", "large"
}) => {
  const { user, isAuthenticated } = useAuth();
  const { 
    togglePopularity, 
    isPostLiked, 
    getPopularityCount 
  } = usePopularity();

  const isLiked = isPostLiked(postId);
  const count = getPopularityCount(postId);

  // Size variants
  const sizeClasses = {
    small: {
      button: "text-xs p-1.5 px-3",
      icon: "text-sm",
      gap: "gap-1"
    },
    default: {
      button: "text-sm p-2 px-4",
      icon: "text-base",
      gap: "gap-2"
    },
    large: {
      button: "text-base p-3 px-5",
      icon: "text-lg",
      gap: "gap-3"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts');
      return;
    }

    if (!user?._id) {
      toast.error('User information not available');
      return;
    }

    togglePopularity(postId, user._id);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isAuthenticated}
      className={`
        flex items-center ${currentSize.gap} ${currentSize.button}
        rounded-xl transition-all duration-200 outline
        ${isLiked 
          ? 'bg-orange-50 text-orange-500 hover:!bg-orange-100 border-orange-400' 
          : 'text-gray-500 hover:!text-orange-500 transition-colors bg-gray-50'
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
      {showCount && (
        <span className="font-medium">
          {count}
        </span>
      )}
    </button>
  );
};

export default PostPopularityButton;
