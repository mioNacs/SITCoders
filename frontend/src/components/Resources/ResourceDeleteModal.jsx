import React, {useState} from 'react';
import { FaTimes, FaTrash, FaSpinner } from 'react-icons/fa';

const ResourceDeleteModal = ({ isOpen, onClose, onConfirm, resourceId }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(resourceId);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <span className="text-xl font-bold text-red-600">!</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Resource</h3>
        </div>
        
        <p className="text-gray-600 mb-6">Are you sure you want to delete this resource? This action cannot be undone.</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            <span>{loading ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDeleteModal;