import React, { useState } from "react";
import { FaUser, FaPen, FaCalendarAlt, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  // Format the creation date
  const formatJoinDate = (dateString) => {
    if (!dateString) return "2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (isLoading) {
    return (
      <div className="pt-20 bg-orange-50 min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 bg-orange-50 min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">
          Please log in to view your profile
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-orange-50 min-h-screen">
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-auto border md:w-100 border-orange-400 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelLogout} 
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:max-w-[90%] lg:max-w-[80%] mx-auto pb-8 px-4">
        <div className="w-full md:w-[40%] bg-white rounded-lg shadow-md border border-orange-100 p-4">
          <h2 className="text-2xl font-bold text-orange-600 mb-4 border-b border-orange-200 pb-2">
            Your Posts
          </h2>
          <div className="flex items-center justify-center h-64 text-gray-400">
            No posts yet
          </div>
        </div>

        <div className="w-full md:w-[60%] bg-white rounded-lg shadow-md border border-orange-100 overflow-hidden">
          <div className="relative w-full bg-gradient-to-r from-orange-400 to-orange-500 h-48 rounded-t-lg">
            <button className="absolute right-4 bottom-4 flex gap-2 items-center bg-white text-orange-500 px-3 py-2 rounded-md shadow-sm hover:bg-orange-50 transition-colors">
              <FaPen size={14} />
              <span className="font-medium">Edit profile</span>
            </button>
          </div>

          <div className="px-6 relative">
            <button 
              className="absolute right-4 top-4 flex gap-2 items-center bg-orange-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors cursor-pointer"
              onClick={initiateLogout}
            >
              <FaSignOutAlt size={14} />
              <span className="font-medium">Log out</span>
            </button>
            
            {/* Rest of your profile section */}
            <div className="absolute -top-16 left-4 w-32 h-32 rounded-full bg-white p-1 shadow-md">
              {user.profile ? (
                <img
                  src={user.profile}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center">
                  <FaUser className="text-orange-400" size={50} />
                </div>
              )}
            </div>

            <div className="pt-20 pb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {user.fullName || "Your Name"}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
