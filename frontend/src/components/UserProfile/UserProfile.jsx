import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePopularity } from "../../context/PopularityContext";
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
import ShareButton from "./ShareButton";

function UserProfile() {
  const { user: currentUser, isAuthenticated, isLoading: authLoading, updateUser, logout, isSuspended } = useAuth();
  const { initializeProfilePopularity } = usePopularity();
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

  // Initialize profile popularity when profile user is loaded
  useEffect(() => {
    if (profileUser && currentUser?._id) {
      initializeProfilePopularity(profileUser._id, profileUser.popularity, currentUser._id);
    }
  }, [profileUser, currentUser?._id, initializeProfilePopularity]);

  // Check admin status for both own and other profiles
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const checkAdminStatus = async () => {
      if (profileUser?.email) {
        try {
          const adminStatus = await verifyIsAdmin(profileUser.email);
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

    if (profileUser) {
      checkAdminStatus();
    }
  }, [profileUser, isAuthenticated, authLoading, navigate]);

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
      <div className="pt-4 min-h-screen bg-orange-50">
        <div className="pt-16 pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card - Takes up 1 column on large screens */}
              <div className="lg:col-span-1 order-1 lg:order-1">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-6 z-20">
                  {/* Profile Header Background */}
                  {isOwnProfile && !isSuspended ? (
                    <ProfileHeader 
                      profileUser={profileUser} 
                      updateUser={updateUser}
                      showDialog={showDialog}
                    />
                  ) : (
                    <div className="relative h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-4 right-4">
                        <ShareButton 
                          user={profileUser} 
                          isOwnProfile={false}
                        />
                      </div>
                    </div>
                  )}

                  {/* Profile Content */}
                  <div className="relative px-6 pb-6">
                    {/* Profile Picture */}
                    <div className="flex justify-center -mt-16 mb-4">
                      <ProfilePicture 
                        user={profileUser} 
                        updateUser={updateUser}
                        showDialog={showDialog}
                        isOwnProfile={isOwnProfile}
                      />
                    </div>

                    {/* Profile Information */}
                    <ProfileInfo 
                      user={profileUser} 
                      isAdmin={isAdmin}
                      adminRole={adminRole}
                      updateUser={updateUser}
                      showDialog={showDialog}
                      isOwnProfile={isOwnProfile}
                    />

                    {/* Action Buttons - Moved to bottom of profile card for better UX */}
                    {isOwnProfile && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <ActionButtons 
                          user={profileUser}
                          isAdmin={isAdmin}
                          showDialog={showDialog}
                          onLogout={handleLogout}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Posts Section - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2 order-2 lg:order-2">
                <PostsSection 
                  user={profileUser}
                  isOwnProfile={isOwnProfile}
                />
              </div>
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
