import React, { useState } from "react";
import { FaEnvelope, FaCalendarAlt, FaPen, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";

const ProfileInfo = ({ user, isAdmin, adminRole, showDialog, isOwnProfile = true }) => {
  const { updateUser } = useAuth();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  const formatJoinDate = (dateString) => {
    if (!dateString) return "2023";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
    setBioText(user?.bio || "");
  };

  const handleCancelEdit = () => {
    setIsEditingBio(false);
    setBioText(user?.bio || "");
  };

  const handleBioChange = (e) => {
    const newBio = e.target.value;
    const size = new Blob([newBio]).size;
    if (size <= 200) {
      setBioText(newBio);
    }
  };

  const handleSaveBio = async () => {
    if (!bioText.trim()) {
      showDialog(
        'Validation Error',
        'Bio cannot be empty.',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await updateUser({
        bio: bioText.trim()
      });

      if (result.success) {
        setIsEditingBio(false);
        showDialog(
          'Success',
          'Bio updated successfully!',
          'success'
        );
      } else {
        showDialog(
          'Update Failed',
          result.message || 'Failed to update bio. Please try again.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      showDialog(
        'Update Failed',
        error.message || 'Failed to update bio. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getBioByteSize = () => {
    return new Blob([bioText]).size;
  };

  const getRemainingBytes = () => {
    return 200 - getBioByteSize();
  };

  return (
    <div className="pt-20 pb-6 w-full">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        {user?.fullName || "Unknown User"}
        {/* only for admins */}
        {isAdmin && (adminRole === "superadmin") && (
          <FaCrown className="text-orange-400" />
        )}
        {isAdmin && (adminRole === "admin") && (
          <FaCrown className="text-blue-400" />
        )}
      </h1>
      <p className="text-orange-500 font-medium">
        @{user?.username || "username"}
      </p>

      <div className="mt-6 space-y-3 text-gray-600">
        {/* Only show email for own profile */}
        {isOwnProfile && (
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-orange-400" />
            <span>{user?.email || "email@example.com"}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-orange-400" />
          <span>Joined {formatJoinDate(user?.createdAt)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-orange-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-700">Bio</h3>
          {/* Only show edit button for own profile */}
          {isOwnProfile && !isEditingBio && (
            <button 
              onClick={handleEditBio}
              className="flex items-center gap-2 bg-orange-500 text-white p-2 px-3 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
            >
              <FaPen size={12} /> 
              Update Bio
            </button>
          )}
        </div>

        {!isEditingBio ? (
          // Display Mode
          <p className="text-gray-600 leading-relaxed">
            {user?.bio || "No bio available"}
          </p>
        ) : (
          // Edit Mode (only for own profile)
          isOwnProfile && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={bioText}
                  onChange={handleBioChange}
                  placeholder="Write something about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                  disabled={loading}
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1">
                  <span className={getRemainingBytes() < 0 ? 'text-red-500' : ''}>
                    {getBioByteSize()}/200 bytes
                  </span>
                </div>
              </div>

              {/* Validation Message */}
              {getRemainingBytes() < 0 && (
                <p className="text-red-500 text-sm">
                  Bio exceeds maximum length by {Math.abs(getRemainingBytes())} bytes
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <FaTimes size={12} />
                  Cancel
                </button>
                <button
                  onClick={handleSaveBio}
                  disabled={loading || getRemainingBytes() < 0 || !bioText.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={12} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck size={12} />
                      Save Bio
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
