import React from 'react';
import { FaTimes, FaSpinner, FaCrown } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';

const AdminRoleModal = ({
  isOpen,
  user,
  onClose,
  onCreateAdmin, // (role) => void
  onRemoveAdmin, // () => void
  creating,
  selectedUserStatus, // { isAdmin: boolean, role: 'admin' | 'superadmin' | null }
  adminStatus, // acting admin status
}) => {
  if (!isOpen || !user) return null;

  const isTargetSuper = selectedUserStatus?.role === 'superadmin';
  const isTargetAdminOnly = selectedUserStatus?.isAdmin && !isTargetSuper;
  const canAct = adminStatus?.role === 'superadmin';

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MdAdminPanelSettings className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  Admin Role Options
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Manage role for {user.fullName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 bg-gray-50 rounded-lg mb-4 md:mb-6">
            <img
              src={
                user.profilePicture?.url ||
                user.profile ||
                'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
              }
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                {user.fullName}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 truncate">
                @{user.username} • {user.email}
              </p>
            </div>
          </div>

          {!canAct ? (
            <p className="text-sm text-gray-600 text-center">Only Super Admins can manage roles.</p>
          ) : isTargetSuper ? (
            <div className="text-center text-sm text-gray-600">
              <FaCrown className="inline text-orange-500 mr-1" /> This user is already a Super Admin.
            </div>
          ) : (
            <div className="space-y-3">
              {isTargetAdminOnly ? (
                <button
                  onClick={onRemoveAdmin}
                  disabled={creating}
                  className="w-full flex items-center justify-between p-3 md:p-4 border border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                      <MdAdminPanelSettings className="text-red-600" size={16} />
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-gray-800 text-sm md:text-base">Remove from Admin</h5>
                      <p className="text-xs md:text-sm text-gray-600">Revoke admin privileges from this user</p>
                    </div>
                  </div>
                  {creating && (
                    <FaSpinner className="animate-spin text-red-600 flex-shrink-0" size={14} />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => onCreateAdmin('admin')}
                  disabled={creating}
                  className="w-full flex items-center justify-between p-3 md:p-4 border border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <FaCrown className="text-blue-600" size={16} />
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-gray-800 text-sm md:text-base">Admin</h5>
                      <p className="text-xs md:text-sm text-gray-600">Can verify users and manage basic settings</p>
                    </div>
                  </div>
                  {creating && (
                    <FaSpinner className="animate-spin text-blue-600 flex-shrink-0" size={14} />
                  )}
                </button>
              )}

              <button
                onClick={() => onCreateAdmin('superadmin')}
                disabled={creating}
                className="w-full flex items-center justify-between p-3 md:p-4 border border-orange-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                    <FaCrown className="text-orange-600" size={16} />
                  </div>
                  <div className="text-left">
                    <h5 className="font-semibold text-gray-800 text-sm md:text-base">Super Admin</h5>
                    <p className="text-xs md:text-sm text-gray-600">Full access including creating other admins</p>
                  </div>
                </div>
                {creating && (
                  <FaSpinner className="animate-spin text-orange-600 flex-shrink-0" size={14} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={creating}
              className="px-3 py-2 md:px-4 md:py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleModal;
