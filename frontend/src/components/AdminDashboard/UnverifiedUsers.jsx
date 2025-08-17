import React from 'react';
import { 
  FaUserCheck, 
  FaUserTimes, 
  FaSpinner, 
  FaEnvelope, 
  FaUsers, 
  FaCalendarAlt 
} from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';

const UnverifiedUsers = ({ 
  unverifiedUsers, 
  handleVerifyUser, 
  handleRejectUser, 
  actionLoading, 
  verifyLoading, 
  rejectLoading, 
  currentAction,
  formatJoinDate 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <MdPendingActions className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Pending User Verifications
              </h2>
              <p className="text-gray-600">
                Review and approve new user registrations
              </p>
            </div>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-lg">
            <span className="text-orange-600 font-semibold">
              {unverifiedUsers.length}{" "}
              {unverifiedUsers.length === 1 ? "User" : "Users"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {unverifiedUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <FaUserCheck className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              No users pending verification at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {unverifiedUsers.map((userItem) => (
              <div
                key={userItem._id}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-orange-200 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          userItem.profilePicture?.url ||
                          userItem.profile ||
                          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <MdPendingActions className="text-white" size={12} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {userItem.fullName}
                        </h3>
                        <h3 className="text-md font-semibold text-orange-600">
                          @{userItem.username}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center space-x-1">
                          <FaEnvelope size={12} />
                          <span>{userItem.email}</span>
                        </span>
                        {userItem.rollNo && (
                          <span className="flex items-center space-x-1">
                            <FaUsers size={12} />
                            <span>Roll: {userItem.rollNo}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <FaCalendarAlt size={12} />
                          <span>
                            Joined: {formatJoinDate(userItem.createdAt)}
                          </span>
                        </span>
                      </div>
                      {userItem.bio && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 italic">
                            "{userItem.bio}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3 lg:flex-shrink-0">
                    <button
                      onClick={() => handleVerifyUser(userItem.email)}
                      disabled={actionLoading}
                      className="flex items-center space-x-2 bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                      {verifyLoading && currentAction === userItem.email ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <FaUserCheck size={16} />
                          <span>Approve</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectUser(userItem.email)}
                      disabled={actionLoading}
                      className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                      {rejectLoading && currentAction === userItem.email ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          <span>Rejecting...</span>
                        </>
                      ) : (
                        <>
                          <FaUserTimes size={16} />
                          <span>Reject</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnverifiedUsers;