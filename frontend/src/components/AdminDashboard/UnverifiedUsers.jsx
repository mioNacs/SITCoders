import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCheck,
  FaUserTimes,
  FaSpinner,
  FaEnvelope,
  FaUsers,
  FaCalendarAlt
} from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import UserSearchFilter from './UserSearchFilter';
import { searchUsersInAdmin } from '../../services/adminApi';

const UnverifiedUsers = ({
  unverifiedUsers = [],
  handleVerifyUser,
  handleRejectUser,
  actionLoading = false,
  verifyLoading = false,
  rejectLoading = false,
  currentAction,
  formatJoinDate
}) => {
  const [filteredUsers, setFilteredUsers] = useState(unverifiedUsers ?? []);

  useEffect(() => {
    setFilteredUsers(unverifiedUsers ?? []);
  }, [unverifiedUsers]);

  const handleFilteredUsersChange = (filtered) => {
    if (filtered === null) {
      setFilteredUsers(unverifiedUsers ?? []);
    } else {
      // Only keep unverified subset
      setFilteredUsers((Array.isArray(filtered) ? filtered : []).filter(u => !u.isAdminVerified));
    }
  };

  const handleSearch = async (query) => {
    const results = await searchUsersInAdmin(query);
    return results.user.filter(u => !u.isAdminVerified);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100">
      <div className="p-4 md:p-6 border-gray-200">
        <div className="flex gap-2 sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <MdPendingActions className="text-orange-600" size={22} />
            </div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                Pending User
              </h2>
          </div>

          <div className="bg-orange-50 px-3 py-1 rounded-lg">
            <span className="text-orange-600 font-semibold text-sm">
              {unverifiedUsers.length} {unverifiedUsers.length === 1 ? 'User' : 'Users'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="px-4 md:px-6 pb-4">
        <UserSearchFilter
          users={unverifiedUsers}
          onSearch={handleSearch}
          onFilteredUsersChange={handleFilteredUsersChange}
          placeholder="Search unverified users by username, name, or email..."
          className="w-full max-w-md"
        />
      </div>

      <div className="p-4 md:p-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaUserCheck className="text-gray-400" size={36} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              {unverifiedUsers.length === 0 ? 'All Caught Up!' : 'No Users Found'}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              {unverifiedUsers.length === 0
                ? 'No users pending verification at the moment.'
                : 'No users match your search criteria. Try adjusting your search terms.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((userItem) => {
              const key = userItem._id || userItem.email || userItem.username;
              const displayName = userItem.fullName || userItem.name || userItem.username || 'Unknown';
              const profileSrc =
                userItem.profilePicture?.url ||
                userItem.profile ||
                'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';

              const isThisAction = currentAction === userItem.email;
              const verifyActive = verifyLoading && isThisAction;
              const rejectActive = rejectLoading && isThisAction;

              return (
                <div
                  key={key}
                  className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 hover:border-orange-200 transition-colors"
                >
                  {/* Mobile-first: column; becomes row on lg */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Link
                        to={`/profile/${userItem.username}`}
                        className="flex-shrink-0"
                        aria-label={`Open profile of ${displayName}`}
                      >
                        <img
                          src={profileSrc}
                          alt={`${displayName} profile`}
                          className="w-16 h-16 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm"
                          loading="lazy"
                          draggable="false"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/profile/${userItem.username}`}
                            className="text-sm md:text-lg font-semibold text-gray-800 hover:text-orange-600 transition-colors truncate"
                            title={displayName}
                          >
                            {displayName}
                          </Link>
                          <Link
                            to={`/profile/${userItem.username}`}
                            className="text-sm md:text-md font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                            title={`@${userItem.username}`}
                          >
                            @{userItem.username}
                          </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1 break-words">
                            <FaEnvelope size={12} />
                            <span className="break-words">{userItem.email}</span>
                          </span>

                          {userItem.rollNo && (
                            <span className="flex items-center gap-1">
                              <FaUsers size={12} />
                              <span>Roll: {userItem.rollNo}</span>
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <FaCalendarAlt size={12} />
                            <span>Joined: {formatJoinDate(userItem.createdAt)}</span>
                          </span>
                        </div>

                        {userItem.bio && (
                          <div className="mt-2">
                            <p className="text-xs md:text-sm text-gray-500 italic line-clamp-3">
                              "{userItem.bio}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: full-width on small screens, inline on lg */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row sm:items-center gap-2 mt-2 lg:mt-0">
                      <button
                        onClick={() => handleVerifyUser(userItem.email)}
                        disabled={actionLoading}
                        aria-disabled={actionLoading}
                        aria-label={`Approve ${userItem.email}`}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-102"
                      >
                        {verifyActive ? (
                          <>
                            <FaSpinner className="animate-spin" aria-hidden="true" />
                            <span className="text-sm">Verifying...</span>
                            <span className="sr-only">verifying</span>
                          </>
                        ) : (
                          <>
                            <FaUserCheck size={14} />
                            <span className="text-sm">Approve</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleRejectUser(userItem.email)}
                        disabled={actionLoading}
                        aria-disabled={actionLoading}
                        aria-label={`Reject ${userItem.email}`}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-102"
                      >
                        {rejectActive ? (
                          <>
                            <FaSpinner className="animate-spin" aria-hidden="true" />
                            <span className="text-sm">Rejecting...</span>
                            <span className="sr-only">rejecting</span>
                          </>
                        ) : (
                          <>
                            <FaUserTimes size={14} />
                            <span className="text-sm">Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnverifiedUsers;
