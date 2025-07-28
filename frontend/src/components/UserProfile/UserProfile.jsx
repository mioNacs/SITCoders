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
  const { user, isAuthenticated, isLoading: authLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState("");

  // Dialog state
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showConfirm: false,
    onConfirm: null,
  });

  const showDialog = (title, message, type = "info", showConfirm = false, onConfirm = null) => {
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
    setDialog({ 
      isOpen: false, 
      title: "", 
      message: "", 
      type: "info", 
      showConfirm: false, 
      onConfirm: null 
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      closeDialog(); // Close the dialog after successful logout
    } catch (error) {
      console.error("Logout error:", error);
      showDialog(
        "Logout Failed",
        "Failed to logout. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check admin status
    const checkAdminStatus = async () => {
      if (user?.email) {
        try {
          const adminStatus = await verifyIsAdmin(user.email);
          setIsAdmin(adminStatus.isAdmin);
          setAdminRole(adminStatus.role);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          setAdminRole("");
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user, isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
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
          <div className="w-full h-full md:w-[40%] order-2 md:order-1">
            {/* Posts Section */}
            <PostsSection />
          </div>

          {/* Profile Section */}
          <div className="w-full md:w-[60%] bg-white rounded-lg shadow-md border border-orange-100 overflow-hidden order-1 md:order-2">
            {/* Profile Header */}
            <ProfileHeader 
              user={user} 
              updateUser={updateUser}
              showDialog={showDialog}
            />

            <div className="flex px-6 relative">
              {/* Action Buttons */}
              <ActionButtons 
                user={user}
                isAdmin={isAdmin}
                showDialog={showDialog}
                onLogout={handleLogout}
              />

              {/* Profile Picture */}
              <ProfilePicture 
                user={user} 
                updateUser={updateUser}
                showDialog={showDialog}
              />

              {/* Profile Information */}
              <ProfileInfo 
                user={user} 
                isAdmin={isAdmin}
                adminRole={adminRole}
                updateUser={updateUser}
                showDialog={showDialog}
              />
            </div>
          </div>
        </div>
      </div>

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
