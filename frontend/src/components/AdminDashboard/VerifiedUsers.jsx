import React, { useState, useEffect } from 'react';
import { 
  FaUserCheck, 
  FaSpinner, 
  FaEnvelope, 
  FaUsers, 
  FaCalendarAlt,
  FaCrown,
  FaTimes 
} from 'react-icons/fa';
import { MdVerifiedUser, MdAdminPanelSettings } from 'react-icons/md';
import { createAdmin, verifyIsAdmin } from '../../services/adminApi';

const VerifiedUsers = ({ 
  verifiedUsers, 
  verifiedLoading, 
  pagination, 
  handlePageChange, 
  formatJoinDate,
  showDialog,
  adminStatus
}) => {
  const [createAdminModal, setCreateAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [userAdminStatus, setUserAdminStatus] = useState({}); // Store admin status for each user
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(false);

  // Check admin status for all verified users
  useEffect(() => {

    const checkAllUsersAdminStatus = async () => {
      if (verifiedUsers.length === 0) return;
      
      setCheckingAdminStatus(true);
      const adminStatusPromises = verifiedUsers.map(async (user) => {
        try {
          const adminInfo = await verifyIsAdmin(user.email);
          return {
            email: user.email,
            isAdmin: adminInfo.isAdmin,
            role: adminInfo.role
          };
        } catch (error) {
          console.error(`Error checking admin status for ${user.email}:`, error);
          return {
            email: user.email,
            isAdmin: false,
            role: null
          };
        }
      });

      try {
        const results = await Promise.all(adminStatusPromises);
        const statusMap = {};
        results.forEach(result => {
          statusMap[result.email] = {
            isAdmin: result.isAdmin,
            role: result.role
          };
        });
        setUserAdminStatus(statusMap);
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingAdminStatus(false);
      }
    };

    checkAllUsersAdminStatus();
  }, [verifiedUsers]);

  const openCreateAdminModal = (user) => {
    setSelectedUser(user);
    setCreateAdminModal(true);
  };

  const closeCreateAdminModal = () => {
    setCreateAdminModal(false);
    setSelectedUser(null);
  };

  const handleCreateAdmin = async (role) => {
    if (!selectedUser) return;

    setCreatingAdmin(true);
    try {
      await createAdmin(selectedUser.email, role);
      
      // Update the user's admin status in local state
      setUserAdminStatus(prev => ({
        ...prev,
        [selectedUser.email]: {
          isAdmin: true,
          role: role
        }
      }));

      closeCreateAdminModal();
      showDialog(
        'Success',
        `${selectedUser.fullName} has been appointed as ${role === 'superadmin' ? 'Super Admin' : 'Admin'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error('Error creating admin:', error);
      showDialog(
        'Error',
        error.message || 'Failed to create admin. Please try again.',
        'error'
      );
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-orange-100">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <MdVerifiedUser className="text-green-600" size={20} md:size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Verified Users
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Users who have been approved and verified
                </p>
              </div>
            </div>
            <div className="bg-green-50 px-3 py-2 md:px-4 md:py-2 rounded-lg self-start sm:self-auto">
              <span className="text-green-600 font-semibold text-sm md:text-base">
                {pagination.totalUsers} Total{" "}
                {pagination.totalUsers === 1 ? "User" : "Users"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {verifiedLoading ? (
            <div className="text-center py-12 md:py-16">
              <FaSpinner className="animate-spin text-orange-500 mx-auto mb-4" size={32} md:size={40} />
              <p className="text-gray-600 text-sm md:text-base">Loading verified users...</p>
            </div>
          ) : verifiedUsers.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="bg-gray-100 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4">
                <MdVerifiedUser className="text-gray-400" size={32} md:size={40} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                No Verified Users Yet
              </h3>
              <p className="text-gray-600 text-sm md:text-base px-4">
                Start verifying users to see them here.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {verifiedUsers.map((userItem) => {
                  const currentUserAdminStatus = userAdminStatus[userItem.email] || { isAdmin: false, role: null };
                  
                  return (
                    <div
                      key={userItem._id}
                      className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 hover:border-green-200 transition-colors"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-start space-x-3 md:space-x-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={
                                userItem.profilePicture?.url ||
                                userItem.profile ||
                                "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                              }
                              alt="Profile"
                              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 md:border-3 border-white shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <FaUserCheck className="text-white" size={10} md:size={12} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                                {userItem.fullName}
                              </h3>
                              <h3 className="text-sm md:text-md font-semibold text-orange-600 truncate">
                                @{userItem.username}
                              </h3>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs md:text-sm text-gray-600 mt-1 space-y-1 sm:space-y-0">
                              <span className="flex items-center space-x-1 truncate">
                                <FaEnvelope size={10} md:size={12} />
                                <span className="truncate">{userItem.email}</span>
                              </span>
                              {userItem.rollNo && (
                                <span className="flex items-center space-x-1">
                                  <FaUsers size={10} md:size={12} />
                                  <span>Roll: {userItem.rollNo}</span>
                                </span>
                              )}
                              <span className="flex items-center space-x-1">
                                <FaCalendarAlt size={10} md:size={12} />
                                <span>
                                  Joined: {formatJoinDate(userItem.createdAt)}
                                </span>
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              
                              {/* Show admin badge if user is an admin */}
                              {checkingAdminStatus ? (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                  <FaSpinner className="animate-spin" size={8} md:size={10} />
                                  <span>Checking...</span>
                                </span>
                              ) : currentUserAdminStatus.isAdmin ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                                  currentUserAdminStatus.role === 'superadmin' 
                                    ? 'bg-orange-100 text-orange-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  <FaCrown size={10} md:size={12} />
                                  <span>
                                    {currentUserAdminStatus.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                  </span>
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <MdVerifiedUser size={10} md:size={12} />
                                <span>Verified User</span>
                              </span>
                              )
                              }
                            </div>
                            {userItem.bio && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 italic line-clamp-2">
                                  "{userItem.bio}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-200 pt-3">
                          <div className="text-left">
                            <div className="text-xs md:text-sm text-gray-500">
                              User ID: {userItem._id.slice(-6).toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Verified Account
                            </div>
                          </div>
                          
                          {/* Create Admin Button - Only show if user is not already an admin and current user has permission */}
                          {!(currentUserAdminStatus.role === 'superadmin') && (adminStatus?.role=== 'superadmin')  && (
                            <button
                              onClick={() => openCreateAdminModal(userItem)}
                              className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105 cursor-pointer text-xs md:text-sm w-full sm:w-auto"
                            >
                              <MdAdminPanelSettings size={14} md:size={16} />
                              <span>Make Admin</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 md:pt-6 gap-4">
                  <div className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
                    Showing{" "}
                    <span className="font-medium">
                      {((pagination.currentPage - 1) * 10) + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * 10, pagination.totalUsers)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {pagination.totalUsers}
                    </span>{" "}
                    results
                  </div>

                  <div className="flex items-center space-x-1 md:space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1 || verifiedLoading}
                      className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>

                    <div className="flex space-x-1">
                      {[...Array(Math.min(3, pagination.totalPages))].map((_, index) => {
                        const pageNumber = Math.max(1, pagination.currentPage - 1) + index;
                        if (pageNumber > pagination.totalPages) return null;
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={verifiedLoading}
                            className={`px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium rounded-md ${
                              pageNumber === pagination.currentPage
                                ? "bg-orange-500 text-white"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasMore || verifiedLoading}
                      className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      {createAdminModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MdAdminPanelSettings className="text-blue-600" size={20} md:size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      Appoint Admin
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      Choose admin role for {selectedUser.fullName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCreateAdminModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <FaTimes size={18} md:size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 bg-gray-50 rounded-lg mb-4 md:mb-6">
                <img
                  src={
                    selectedUser.profilePicture?.url ||
                    selectedUser.profile ||
                    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                    {selectedUser.fullName}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    @{selectedUser.username} • {selectedUser.email}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-4 md:mb-6 text-center text-sm md:text-base">
                Select the admin role you want to assign to this user:
              </p>

              {/* Role Selection Buttons */}
              <div className="space-y-3">
                {!userAdminStatus[selectedUser.email]?.isAdmin &&(
                    <button
                  onClick={() => handleCreateAdmin('admin')}
                  disabled={creatingAdmin}
                  className="w-full flex items-center justify-between p-3 md:p-4 border border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <FaCrown className="text-blue-600" size={16} md:size={20} />
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-gray-800 text-sm md:text-base">Admin</h5>
                      <p className="text-xs md:text-sm text-gray-600">
                        Can verify users and manage basic settings
                      </p>
                    </div>
                  </div>
                  {creatingAdmin && (
                    <FaSpinner className="animate-spin text-blue-600 flex-shrink-0" size={14} md:size={16} />
                  )}
                </button>
                )} 

                <button
                  onClick={() => handleCreateAdmin('superadmin')}
                  disabled={creatingAdmin}
                  className="w-full flex items-center justify-between p-3 md:p-4 border border-orange-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                      <FaCrown className="text-orange-600" size={16} md:size={20} />
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-gray-800 text-sm md:text-base">Super Admin</h5>
                      <p className="text-xs md:text-sm text-gray-600">
                        Full access including creating other admins
                      </p>
                    </div>
                  </div>
                  {creatingAdmin && (
                    <FaSpinner className="animate-spin text-orange-600 flex-shrink-0" size={14} md:size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCreateAdminModal}
                  disabled={creatingAdmin}
                  className="px-3 py-2 md:px-4 md:py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifiedUsers;