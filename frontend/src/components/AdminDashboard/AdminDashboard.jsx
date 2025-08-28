import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  verifyIsAdmin,
  getAllUnverifiedUsers,
  getVerifiedUsers,
  verifyUser,
  rejectUser,
  getSuspendedUsers,
} from "../../services/adminApi.js";
import { FaUsers, FaEnvelope, FaCrown, FaSpinner, FaBookOpen } from "react-icons/fa";
import { MdAdminPanelSettings, MdVerifiedUser } from "react-icons/md";
import Dialog from "../UI/Dialog";

// Import the new components
import UnverifiedUsers from "./UnverifiedUsers";
import VerifiedUsers from "./VerifiedUsers";
import SuspendedUsers from "./SuspendedUsers";
import ResourceManagement from './ResourceManagement';

function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State management
  const [adminStatus, setAdminStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [verifiedLoading, setVerifiedLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [showUsers, setShowUsers] = useState("verified"); // Set verified as default
  const [suspendedCount, setSuspendedCount] = useState(0);
  const [activeTab, setActiveTab] = useState('users');

  const handleShowUsers = (type) => {
    setShowUsers(type);
  };

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasMore: false,
  });

  // Dialog states
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
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAdminStatus = async () => {
    if (!user?.email) {
      return { isAdmin: false };
    }
    
    try {
      const status = await verifyIsAdmin(user.email);
      return status;
    } catch (error) {
      console.error("Error verifying admin status:", error);
      return { isAdmin: false };
    }
  };

  const extractUsers = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === 'object') {
      for (const key of ['users', 'suspendedUsers', 'suspended', 'accounts', 'suspendedAccounts', 'data', 'result', 'results', 'list']) {
        const val = payload[key];
        if (Array.isArray(val)) return val;
      }
    }
    return [];
  };

  const fetchSuspendedUsersCount = async () => {
    try {
      const data = await getSuspendedUsers();
      const arr = extractUsers(data);
      setSuspendedCount(arr.length);
    } catch (error) {
      console.error('Error fetching suspended users count:', error);
      setSuspendedCount(0);
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const data = await getAllUnverifiedUsers();
      setUnverifiedUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      showDialog("Error", "Failed to fetch unverified users.", "error");
    }
  };

  const fetchVerifiedUsers = async (page = 1, limit = 10) => {
    try {
      setVerifiedLoading(true);
      const data = await getVerifiedUsers(page, limit);
      setVerifiedUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Error fetching verified users:", error);
      showDialog("Error", "Failed to fetch verified users.", "error");
    } finally {
      setVerifiedLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVerifiedUsers(newPage, 10);
    }
  };

  // Update a single verified user's suspension state locally
  const onUpdateUserSuspension = (email, isSuspended, suspensionEnd = null, suspensionReason = undefined) => {
    setVerifiedUsers(prev => {
      if (!Array.isArray(prev)) return prev;
      return prev.map(u => {
        if (u.email !== email) return u;
        return {
          ...u,
          isSuspended: !!isSuspended,
          suspensionEnd: isSuspended ? suspensionEnd || u.suspensionEnd || null : null,
          ...(suspensionReason !== undefined ? { suspensionReason } : {}),
        };
      });
    });
  };

  const handleVerifyUser = async (email) => {
    setActionLoading(true);
    setVerifyLoading(true);
    setCurrentAction(email);

    try {
      await verifyUser(email);
      await fetchUnverifiedUsers();
      await fetchVerifiedUsers(pagination.currentPage);
      showDialog("Success", "User verified successfully!", "success");
    } catch (error) {
      console.error("Error verifying user:", error);
      showDialog("Error", "Failed to verify user.", "error");
    } finally {
      setActionLoading(false);
      setVerifyLoading(false);
      setCurrentAction(null);
    }
  };

  const handleRejectUser = async (email) => {
    setActionLoading(true);
    setRejectLoading(true);
    setCurrentAction(email);

    try {
      await rejectUser(email);
      await fetchUnverifiedUsers();
      showDialog("Success", "User rejected successfully!", "success");
    } catch (error) {
      console.error("Error rejecting user:", error);
      showDialog("Error", "Failed to reject user.", "error");
    } finally {
      setActionLoading(false);
      setRejectLoading(false);
      setCurrentAction(null);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    getAdminStatus().then((res) => {
      if (!res.isAdmin) {
        navigate("/");
      } else {
        setAdminStatus(res);
        fetchUnverifiedUsers();
        fetchVerifiedUsers();
        fetchSuspendedUsersCount();
      }
      setLoading(false);
    });
  }, [user, navigate, isAuthenticated, authLoading]);

  // Show loading while auth is being checked
  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center px-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-orange-500 mx-auto mb-4" size={32} />
          <div className="text-lg md:text-xl text-gray-600">Loading Admin Dashboard...</div>
        </div>
      </div>
    );
  }

  const activeTabClasses = (tabName) => 
    `flex items-center gap-2 px-4 py-3 text-lg font-medium transition-colors ${
      activeTab === tabName
        ? 'text-orange-600 bg-orange-100 border-b-2 border-orange-500'
        : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
    }`;


  return (
    <>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-8">
          
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 md:p-3 rounded-full flex-shrink-0">
                  <MdAdminPanelSettings className="text-white" size={24} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 truncate">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    Manage user verifications and system settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Profile Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8 border border-orange-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4 md:space-x-6 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      user?.profilePicture?.url ||
                      "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    }
                    alt="Admin Profile"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-orange-200"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-1">
                    <FaCrown className="text-white" size={12} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="truncate">{user?.fullName}</span>
                    <FaCrown
                      className={`${
                        adminStatus.role === "superadmin"
                          ? "text-orange-400"
                          : "text-blue-500"
                      } flex-shrink-0`}
                      size={16}
                    />
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 flex items-center space-x-1 mt-1">
                    <FaEnvelope size={12} className="flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-green-100 to-green-200 px-3 py-2 md:px-4 md:py-2 rounded-full">
                  <span className="text-green-800 font-semibold flex items-center gap-2 text-sm md:text-base">
                    <MdVerifiedUser className="flex-shrink-0" />
                    <span className="capitalize">{adminStatus.role}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Tabs */}
          <div className="flex justify-start items-end mb-6 border-b border-gray-200">
            <button className={activeTabClasses('users')} onClick={() => setActiveTab('users')}>
              <FaUsers />
              <span>Users</span>
            </button>
            <button className={activeTabClasses('resources')} onClick={() => setActiveTab('resources')}>
              <FaBookOpen />
              <span>Resources</span>
            </button>
          </div>

          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                <div 
                  onClick={() => handleShowUsers("unverified")}
                  className={`bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 ${
                    showUsers === "unverified" ? "border-orange-500" : "border-white"
                  } cursor-pointer hover:border-orange-500 transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <FaUsers className="text-orange-500 flex-shrink-0" size={18} />
                    <span className="text-sm md:text-base font-medium text-gray-600">
                      Pending Users
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-2">
                    {unverifiedUsers.length}
                  </div>
                </div>
                
                <div 
                  onClick={() => handleShowUsers("verified")}
                  className={`bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 ${
                    showUsers === "verified" ? "border-green-500" : "border-white"
                  } cursor-pointer hover:border-green-500 transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <FaUsers className="text-green-500 flex-shrink-0" size={18} />
                    <span className="text-sm md:text-base font-medium text-gray-600">
                      Verified Users
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-2">
                    {pagination.totalUsers || verifiedUsers.length}
                  </div>
                </div>

                <div 
                  onClick={() => handleShowUsers("suspended")}
                  className={`bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 ${
                    showUsers === "suspended" ? "border-red-500" : "border-white"
                  } cursor-pointer hover:border-red-500 transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <FaUsers className="text-red-500 flex-shrink-0" size={18} />
                    <span className="text-sm md:text-base font-medium text-gray-600">
                      Suspended Users
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-2">
                    {suspendedCount}
                  </div>
                </div>
              </div>

              {/* Unverified Users Component */}
              {showUsers === "unverified" && (
                <UnverifiedUsers
                  unverifiedUsers={unverifiedUsers}
                  handleVerifyUser={handleVerifyUser}
                  handleRejectUser={handleRejectUser}
                  actionLoading={actionLoading}
                  verifyLoading={verifyLoading}
                  rejectLoading={rejectLoading}
                  currentAction={currentAction}
                  formatJoinDate={formatJoinDate}
                />
              )}

              {/* Verified Users Component */}
              {showUsers === "verified" && (
                <VerifiedUsers
                  verifiedUsers={verifiedUsers}
                  showDialog={showDialog}
                  verifiedLoading={verifiedLoading}
                  pagination={pagination}
                  handlePageChange={handlePageChange}
                  formatJoinDate={formatJoinDate}
                  adminStatus={adminStatus}
                  onRefresh={() => fetchVerifiedUsers(pagination.currentPage)}
                  onSuspendedCountRefresh={fetchSuspendedUsersCount}
                  onUpdateUserSuspension={onUpdateUserSuspension}
                />
              )}

              {/* Suspended Users Component */}
              {showUsers === "suspended" && (
                <SuspendedUsers
                  showDialog={showDialog}
                  adminStatus={adminStatus}
                  onCountChange={setSuspendedCount}
                  onUpdateUserSuspension={onUpdateUserSuspension}
                />
              )}
            </>
          )}

          {/* Resources Tab Content */}
          {activeTab === 'resources' && (
            <ResourceManagement />
          )}

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

export default AdminDashboard;