import React from 'react';

const Dialog = ({ isOpen, onClose, title, message, type = 'info', onConfirm, showConfirm = false }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: '✕',
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: '!',
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'confirm':
        return {
          icon: '?',
          bgColor: 'bg-orange-100',
          iconColor: 'text-orange-600',
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        };
      default:
        return {
          icon: 'i',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const { icon, bgColor, iconColor, buttonColor } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mr-4`}>
            <span className={`text-xl font-bold ${iconColor}`}>{icon}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          {showConfirm && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={showConfirm ? onConfirm : onClose}
            className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}
          >
            {showConfirm ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;