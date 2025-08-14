import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import ShareButton from "./ShareButton";

const ProfileHeader = ({ showDialog, profileUser }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.fullName.trim()) {
      showDialog(
        "Validation Error",
        "Full name cannot be empty.",
        "error"
      );
      return;
    }

    if (!formData.username.trim()) {
      showDialog(
        "Validation Error",
        "Username cannot be empty.",
        "error"
      );
      return;
    }

    // Username validation (alphanumeric + underscore only)
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!usernamePattern.test(formData.username)) {
      showDialog(
        "Invalid Username",
        "Username can only contain letters, numbers, and underscores.",
        "error"
      );
      return;
    }

    if (formData.username.trim().length < 3) {
      showDialog(
        "Username too short",
        "Username must be at least 3 characters long.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Use the updateUser function from AuthContext
      const result = await updateUser({
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
      });

      if (result.success) {
        setIsEditing(false);
        showDialog(
          "Profile Updated",
          "Your profile has been updated successfully.",
          "success"
        );
      } else {
        showDialog(
          "Update Failed",
          result.message || "Failed to update profile. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showDialog(
        "Update Failed",
        error.message || "Failed to update profile. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-orange-300/30"></div>
      
      {!isEditing ? (
        // View Mode
        <div className="z-50 relative top-4 right-4 flex flex-col gap-2 items-end">
        <button
          onClick={handleEditClick}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-sm hover:bg-white/30 transition-all duration-200 border border-white/20 cursor-pointer"
        >
          <FiEdit2 size={16} />
          <span className="text-sm font-medium">Edit Profile</span>
        </button>
        <ShareButton 
          user={profileUser}
          isOwnProfile={true}
        />
        </div>
      ) : (
        // Edit Mode Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your username"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
