import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ThumbnailViewModal = ({ isOpen, onClose, thumbnailUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[70] p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <FaTimes size={16} />
        </button>
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ThumbnailViewModal;