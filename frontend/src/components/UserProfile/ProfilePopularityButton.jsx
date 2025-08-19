import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usePopularity } from '../../context/PopularityContext';
import { toast } from 'react-toastify';

const ProfilePopularityButton = ({ 
  profileId, 
  className = "",
  showCount = true,
  size = "default" // "small", "default", "large"
}) => {
  const { user, isAuthenticated } = useAuth();
  const { 
    toggleProfilePopularity, 
    isProfileLiked, 
    getProfilePopularityCount 
  } = usePopularity();

  const isLiked = isProfileLiked(profileId);
  const count = getProfilePopularityCount(profileId);

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
      toast.error('Please log in to like profiles');
      return;
    }

    if (!user?._id) {
      toast.error('User information not available');
      return;
    }

    // Don't allow users to like their own profile
    if (profileId === user._id) {
      toast.error("You can't like your own profile");
      return;
    }
    
    toggleProfilePopularity(profileId, user._id);
  };

  // Don't show the button for the user's own profile
  if (profileId === user?._id) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isAuthenticated}
      className={`
        flex items-center ${currentSize.gap} ${currentSize.button}
        rounded-xl transition-all duration-200 outline
        ${isLiked 
          ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 hover:text-orange-500'
        }
        ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isAuthenticated ? (isLiked ? 'Unlike Profile' : 'Like Profile') : 'Login to like'}
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

export default ProfilePopularityButton;
