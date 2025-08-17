import React, { useEffect, useState } from 'react';
import { FaTimes, FaBan, FaSpinner } from 'react-icons/fa';

const SuspendUserModal = ({ isOpen, user, onClose, onSubmit, submitting }) => {
  const [durationIn, setDurationIn] = useState('days');
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDuration('');
      setDurationIn('days');
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-bold text-red-600">Suspend User Account</h3>
            <button onClick={onClose} disabled={submitting} className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50">
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          {/* User */}
          <div className="flex items-center space-x-3 mb-4 md:mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <img
              src={user.profilePicture?.url || user.profile || 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'}
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{user.fullName}</h4>
              <p className="text-xs md:text-sm text-gray-600 truncate">@{user.username} • {user.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suspension Duration</label>
              <select
                value={durationIn}
                onChange={(e) => setDurationIn(e.target.value)}
                disabled={submitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:opacity-50"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
                <option value="forever">Forever</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration Amount</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={submitting || durationIn === 'forever'}
                placeholder={`Enter number of ${durationIn}`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={submitting}
                placeholder="Enter reason for suspension (visible in email)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} disabled={submitting} className="px-3 py-2 md:px-4 md:py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm md:text-base">
              Cancel
            </button>
            <button
              onClick={() => onSubmit({ durationIn, duration: durationIn === 'forever' ? 'forever' : Number(duration), reason: reason?.trim() })}
              disabled={submitting || (!duration && durationIn !== 'forever')}
              className="px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center space-x-2"
            >
              {submitting && <FaSpinner className="animate-spin" size={14} />}
              <FaBan size={14} />
              <span>Suspend User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendUserModal;
