import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaFacebookF,
  FaLinkedinIn,
  FaLink,
  FaCheck,
  FaShare,
  FaWhatsapp
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const ShareResourceModal = ({ isOpen, onClose, resource }) => {
  const [copyStatus, setCopyStatus] = useState('copy');
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate resource URL
  const resourceUrl = resource?.link;
  
  // Generate share content
  const shareTitle = `Check out this resource: ${resource?.title} from SITCoders!`;

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resourceUrl);
      setCopyStatus('copied');
      
      setTimeout(() => {
        setCopyStatus('copy');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      const textArea = document.createElement('textarea');
      textArea.value = resourceUrl;
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
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(resourceUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resourceUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resourceUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const whatsappMessage = `${shareTitle}\n${resourceUrl}`;
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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

  if (!isOpen || !resource) return null;

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
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <FaShare className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Share Resource
              </h3>
              <p className="text-sm text-gray-500">
                Share this resource with others
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
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Share on social media
              </h4>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleTwitterShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="bg-black p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaXTwitter className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">X</span>
                </button>
                <button
                  onClick={handleFacebookShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="bg-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaFacebookF className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Facebook</span>
                </button>
                <button
                  onClick={handleLinkedInShare}
                  className="flex flex-col cursor-pointer items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-blue-700 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="bg-blue-700 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FaLinkedinIn className="text-white" size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                </button>
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
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Or copy link
              </h4>
              <div className="flex gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-auto">
                  <p className="text-sm text-gray-600 truncate">
                    {resourceUrl}
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

export default ShareResourceModal;