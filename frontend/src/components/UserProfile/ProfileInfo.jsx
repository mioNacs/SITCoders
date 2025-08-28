import React, { useState } from "react";
import { FaEnvelope, FaCalendarAlt, FaPen, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { usePopularity } from "../../context/PopularityContext";
import ReputationDisplay from "./ReputationDisplay";

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
  <div className="text-center min-h-65">
      {/* User Name with Admin Badge */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.fullName || "Unknown User"}
        </h1>
        {isAdmin && adminRole && (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            adminRole === "superadmin" 
              ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-300" 
              : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300"
          }`}>
            <FaCrown className={adminRole === "superadmin" ? "text-orange-500" : "text-blue-500"} size={12} />
            <span className="capitalize">{adminRole}</span>
          </div>
        )}
      </div>

      {/* Username */}

      <p className="text-gray-600 mb-2">@{user?.username || "username"}</p>

      {/* Reputation Display */}
      <div className="mb-4 flex justify-center">
        <ReputationDisplay userId={user?._id} compact={false} isOwnProfile = {isOwnProfile} />
      </div>

      {/* Bio Section */}
      <div className="mb-6">
        {isEditingBio ? (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={bioText}
                onChange={handleBioChange}
                placeholder="Tell us about yourself..."
                className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                rows={3}
                disabled={loading}
              />
              <div className={`absolute bottom-2 right-3 text-xs ${
                getRemainingBytes() < 20 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {getRemainingBytes()} bytes remaining
              </div>
            </div>
            
            {getRemainingBytes() < 0 && (
              <p className="text-red-500 text-sm">
                Bio exceeds maximum length by {Math.abs(getRemainingBytes())} bytes
              </p>
            )}
            
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaTimes size={12} />
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                disabled={loading || getRemainingBytes() < 0 || !bioText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors min-w-[100px] justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={12} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaCheck size={12} />
                    <span>Save Bio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <p className="text-gray-700 leading-relaxed mb-2 min-h-[1.5rem]">
              {user?.bio || "No bio available"}
            </p>
            {isOwnProfile && (
              <button
                onClick={handleEditBio}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-all duration-200 mx-auto"
              >
                <FaPen size={12} />
                Edit bio
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Details */}
      <div className="space-y-3 text-sm">
        {/* Only show email for own profile */}
        {isOwnProfile && (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <FaEnvelope className="text-orange-500" size={16} />
            <span>{user?.email || "No email"}</span>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <FaCalendarAlt className="text-orange-500" size={16} />
          <span>Joined {formatJoinDate(user?.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
