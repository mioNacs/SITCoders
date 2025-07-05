import React, { useEffect, useState, useRef } from "react";
import {
  FaUser,
  FaPen,
  FaCalendarAlt,
  FaSignOutAlt,
  FaEnvelope,
  FaCamera,
  FaSpinner,
} from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { verifyIsAdmin } from "../../services/adminApi.js";
import { updateProfilePicture } from "../../services/api.js";
import Dialog from "../UI/Dialog";

function UserProfile() {
  const { user, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [adminStatus, setAdminStatus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Dialog states
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showConfirm: false,
    onConfirm: null,
  });

  const showDialog = (
    title,
    message,
    type = "info",
    showConfirm = false,
    onConfirm = null
  ) => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
      showConfirm,
      onConfirm,
    });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const getAdminStatus = async () => {
    if (user && user.email) {
      const isAdmin = await verifyIsAdmin(user.email);
      return isAdmin;
    }
    return false;
  };

  useEffect(() => {
    getAdminStatus().then((res) => {
      setAdminStatus(res);
    });
  }, [user]);

  const initiateLogout = () => {
    showDialog(
      "Confirm Logout",
      "Are you sure you want to logout? You will need to login again to access your account.",
      "confirm",
      true,
      async () => {
        closeDialog();
        await logout();
        navigate("/");
        showDialog(
          "Logged Out",
          "You have been successfully logged out.",
          "success"
        );
      }
    );
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        showDialog(
          "Invalid File Type",
          "Please select a valid image file (JPEG, JPG, PNG, or WebP).",
          "error"
        );
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showDialog(
          "File Too Large",
          "Please select an image smaller than 5MB.",
          "error"
        );
        return;
      }

      // Show confirmation dialog
      showDialog(
        "Update Profile Picture",
        `Are you sure you want to update your profile picture with "${file.name}"?`,
        "confirm",
        true,
        () => {
          closeDialog();
          uploadProfilePicture(file);
        }
      );
    }
  };

  const uploadProfilePicture = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await updateProfilePicture(formData);

      // Update user context with new profile picture
      updateUser({
        profile: response.user.profile,
      });

      showDialog("Success", "Profile picture updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      showDialog(
        "Upload Failed",
        error.message || "Failed to update profile picture. Please try again.",
        "error"
      );
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    <>
      <div className="pt-20 bg-orange-50 min-h-screen">
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

            <div className="flex px-6 relative">
              <div className="absolute right-4 top-4 flex flex-col gap-2 items-end">
                {adminStatus.isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className=" flex gap-2 items-center bg-orange-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    <MdOutlineAdminPanelSettings size={20} />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}
                <button
                  className="flex gap-2 items-center bg-orange-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors cursor-pointer"
                  onClick={initiateLogout}
                >
                  <FaSignOutAlt size={14} />
                  <span className="font-medium">Log out</span>
                </button>
              </div>

              {/* Profile Picture Section */}
              <div className="absolute -top-16 left-4 w-32 h-32 rounded-full bg-white p-1 shadow-md">
                <div className="relative w-full h-full">
                  {user.profile? (
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

                  {/* Camera/Upload Button */}
                  <button
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Update profile picture"
                  >
                    {uploading ? (
                      <FaSpinner className="animate-spin" size={14} />
                    ) : (
                      <FaCamera size={14} />
                    )}
                  </button>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

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
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Component */}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        showConfirm={dialog.showConfirm}
        onConfirm={dialog.onConfirm}
      />
    </>
  );
}

export default UserProfile;
