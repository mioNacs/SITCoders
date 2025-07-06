import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { verifyIsAdmin } from "../../services/adminApi.js";
import Dialog from "../UI/Dialog";

// Import sub-components
import ProfileHeader from "./ProfileHeader";
import ProfilePicture from "./ProfilePicture";
import ProfileInfo from "./ProfileInfo";
import PostsSection from "./PostsSection";
import ActionButtons from "./ActionButtons";

function UserProfile() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [adminStatus, setAdminStatus] = useState(false);

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
      <div className="pt-20 bg-orange-50 min-h-screen select-none">
        <div className="flex flex-col md:flex-row gap-6 md:max-w-[90%] lg:max-w-[80%] mx-auto pb-8 px-4">
          <div className="w-full md:w-[40%] order-2 md:order-1">
            {/* Posts Section */}
            <PostsSection />
          </div>

          {/* Profile Section */}
          <div className="w-full md:w-[60%] bg-white rounded-lg shadow-md border border-orange-100 overflow-hidden order-1 md:order-2">
            {/* Profile Header */}
            <ProfileHeader showDialog={showDialog} />

            <div className="flex px-6 relative">
              {/* Action Buttons */}
              <ActionButtons
                adminStatus={adminStatus}
                onLogout={initiateLogout}
              />

              {/* Profile Picture */}
              <ProfilePicture
                showDialog={showDialog}
                closeDialog={closeDialog}
              />

              {/* Profile Information */}
              <ProfileInfo
                user={user}
                adminStatus={adminStatus}
                showDialog={showDialog}
              />
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
