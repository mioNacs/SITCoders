import React from 'react';
import { FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { FaCrown } from 'react-icons/fa6';

const ProfileInfo = ({ user, adminStatus }) => {
  const formatJoinDate = (dateString) => {
    if (!dateString) return "2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="pt-20 pb-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        {user.fullName || "Your Name"}
        {/* only for admins */}
        {adminStatus.isAdmin && (
          <FaCrown
            className={
              adminStatus.role === "superadmin"
                ? "text-orange-400"
                : "text-blue-500"
            }
          />
        )}
      </h1>
      <p className="text-orange-500 font-medium">
        @{user.username || "username"}
      </p>

      <div className="mt-6 space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-orange-400" />
          <span>{user.email || "email@example.com"}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-orange-400" />
          <span>Joined {formatJoinDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-orange-100">
        <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
        <p className="text-gray-600">
          {user.bio || "No bio available"}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;