import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaFacebookF,
  FaLinkedinIn,
  FaLink,
  FaCheck,
  FaShare,
  FaWhatsapp,
  FaUser
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const SharePostModal = ({ isOpen, onClose, post }) => {
  const [copyStatus, setCopyStatus] = useState('copy');
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate post URL
  const postUrl = `${window.location.origin}/post/${post?._id}`;
  
  // Generate share content
  const shareTitle = `Check out this post by ${post?.author?.fullName || 'Unknown'} on SITCoders!`;
  const shareDescription = post?.content?.substring(0, 150) + (post?.content?.length > 150 ? '...' : '');

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopyStatus('copied');
      
      setTimeout(() => {
        setCopyStatus('copy');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopyStatus('copied');
      setTimeout(() => {
        setCopyStatus('copy');
      }, 2000);
    }
  };

  // Social media share handlers
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(postUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const whatsappMessage = `${shareTitle}\n${postUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle modal close
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setCopyStatus('copy');
    }, 200);
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Format date function
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  if (!isOpen || !post) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <FaShare className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Share Post
              </h3>
              <p className="text-sm text-gray-500">
                Share this post with others
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Social Media Buttons */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Share on social media
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {/* Twitter */}
                <button
                  onClick={handleTwitterShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="bg-black p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaXTwitter className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">X</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebookShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="bg-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaFacebookF className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Facebook</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleLinkedInShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-700 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="bg-blue-700 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaLinkedinIn className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="bg-green-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaWhatsapp className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Copy Link */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Or copy link
              </h4>
              <div className="flex gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-auto">
                  <p className="text-sm text-gray-600 truncate">
                    {postUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 cursor-pointer rounded-lg font-medium transition-all duration-200 flex items-center gap-2 min-w-[100px] justify-center ${
                    copyStatus === 'copied'
                      ? 'bg-green-500 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {copyStatus === 'copied' ? (
                    <>
                      <FaCheck size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaLink size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
