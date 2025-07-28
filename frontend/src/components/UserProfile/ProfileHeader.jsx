import React, { useState } from "react";
import { FaPen, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const ProfileHeader = ({ showDialog }) => {
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

    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Regex to allow only letters, numbers, and underscores
    if (!usernameRegex.test(formData.username)) {
      showDialog(
        "Invalid Username",
        "Username can only contain letters, numbers, and underscores.",
        "error"
      );
      return;
    }

    if (formData.username.length < 3) {
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
    <div className="relative w-full bg-gradient-to-r from-orange-400 to-orange-500 h-48 rounded-t-lg">
      {!isEditing ? (
        // View Mode
        <button
          onClick={handleEditClick}
          className="absolute right-4 bottom-4 flex gap-2 items-center bg-white text-orange-500 px-3 py-2 rounded-md shadow-sm hover:bg-orange-50 transition-colors cursor-pointer"
        >
          <FaPen size={14} />
          <span className="font-medium">Edit profile</span>
        </button>
      ) : (
        // Edit Mode
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white bg-opacity-95 rounded-lg p-6 shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Enter your username"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <FaTimes size={14} className="inline mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center cursor-pointer"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" size={14} />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheck size={14} className="mr-1" />
                    Save
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
