import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { verifyIsAdmin } from "../../services/adminApi.js";
import { getUser } from "../../services/api.js";
import Dialog from "../UI/Dialog";

// Import sub-components
import ProfileHeader from "./ProfileHeader";
import ProfilePicture from "./ProfilePicture";
import ProfileInfo from "./ProfileInfo";
import PostsSection from "./PostsSection";
import ActionButtons from "./ActionButtons";

function UserProfile() {
  const { user: currentUser, isAuthenticated, isLoading: authLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !username || username === currentUser?.username;
  
  const [profileUser, setProfileUser] = useState(isOwnProfile ? currentUser : null);
  const [loading, setLoading] = useState(!isOwnProfile);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [error, setError] = useState(null);

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
      closeDialog();
    } catch (error) {
      console.error("Logout error:", error);
      showDialog(
        "Logout Failed",
        "Failed to logout. Please try again.",
        "error"
      );
    }
  };

  // Fetch other user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isOwnProfile) {
        setProfileUser(currentUser);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await getUser(username);
        setProfileUser(userData.user);
        setError(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };

    if (username && !isOwnProfile) {
      fetchUserProfile();
    } else if (isOwnProfile && currentUser) {
      setProfileUser(currentUser);
      setLoading(false);
    }
  }, [username, isOwnProfile, currentUser]);

  // Check admin status (only for own profile)
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const checkAdminStatus = async () => {
      if (isOwnProfile && currentUser?.email) {
        try {
          const adminStatus = await verifyIsAdmin(currentUser.email);
          setIsAdmin(adminStatus.isAdmin);
          setAdminRole(adminStatus.role);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          setAdminRole("");
        }
      } else {
        setIsAdmin(false);
        setAdminRole("");
      }
    };

    checkAdminStatus();
  }, [currentUser, isAuthenticated, authLoading, navigate, isOwnProfile]);

  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="pt-20 bg-orange-50 min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">
          Please log in to view profiles
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
            <PostsSection 
              user={profileUser}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Profile Section */}
          <div className="w-full md:w-[60%] bg-white rounded-lg shadow-md border border-orange-100 overflow-hidden order-1 md:order-2">
            {/* Profile Header - Only show edit for own profile */}
            {isOwnProfile ? (
              <ProfileHeader 
                user={profileUser} 
                updateUser={updateUser}
                showDialog={showDialog}
              />
            ) : (
              <div className="relative w-full bg-gradient-to-r from-orange-400 to-orange-500 h-48 rounded-t-lg">
                {/* Static header for other users */}
              </div>
            )}

            <div className="flex px-6 relative">
              {/* Action Buttons - Only show for own profile */}
              {isOwnProfile && (
                <ActionButtons 
                  user={profileUser}
                  isAdmin={isAdmin}
                  showDialog={showDialog}
                  onLogout={handleLogout}
                />
              )}

              {/* Profile Picture - Always use ProfilePicture component */}
              <ProfilePicture 
                user={profileUser} 
                updateUser={updateUser}
                showDialog={showDialog}
                isOwnProfile={isOwnProfile}
              />

              {/* Profile Information */}
              <ProfileInfo 
                user={profileUser} 
                isAdmin={isAdmin}
                adminRole={adminRole}
                updateUser={updateUser}
                showDialog={showDialog}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <Dialog
          isOpen={dialog.isOpen}
          onClose={closeDialog}
          title={dialog.title}
          message={dialog.message}
          type={dialog.type}
          showConfirm={dialog.showConfirm}
          onConfirm={dialog.onConfirm}
        />
      )}
    </>
  );
}

export default UserProfile;
