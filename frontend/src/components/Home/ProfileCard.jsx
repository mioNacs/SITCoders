import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaStar } from 'react-icons/fa';

const ProfileCard = ({ user, isAdmin, adminLoading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-300 to-amber-400 blur-sm -z-10 transform scale-110"></div>
          {user?.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400 border-2 border-white shadow-md rounded-full" />
          )}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          {user?.fullName || user?.username || "User"}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-amber-500">
          <FaStar />
          <span className="text-gray-700">
            Popularity: <span className="font-medium">{user?.popularity || 0}</span>
          </span>
        </div>
        {!adminLoading && isAdmin && (
          <div className="mt-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            Administrator
          </div>
        )}
        <Link 
          to={"/profile"} 
          className="text-center mt-4 w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all"
        >
          Your Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;