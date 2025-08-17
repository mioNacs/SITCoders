import { useEffect } from 'react';
import { FaTrash, FaSpinner } from 'react-icons/fa';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  deleteLoading,
  postId 
}) => {
  
  // Always call hooks; control logic inside effect
  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <FaTrash className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Delete Post
              </h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this post? This will permanently
            remove the post and all its content.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(postId)}
              disabled={deleteLoading === postId}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteLoading === postId ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FaTrash />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;