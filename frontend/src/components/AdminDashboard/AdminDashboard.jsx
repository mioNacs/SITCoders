import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  verifyIsAdmin,
  getAllUnverifiedUsers,
  verifyUser,
  rejectUser,
} from "../../services/adminApi";
import { useNavigate } from "react-router-dom";
import Dialog from "../UI/Dialog";
import {
  FaCrown,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import {
  MdVerifiedUser,
  MdPendingActions,
  MdAdminPanelSettings,
} from "react-icons/md";

function AdminDashboard() {
  const { user } = useAuth();
  const [adminStatus, setAdminStatus] = useState(false);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectLoading, setrejectLoading] = useState(false);
  const [verifyLoading, setverifyLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const navigate = useNavigate();

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

  const fetchUnverifiedUsers = async () => {
    try {
      const data = await getAllUnverifiedUsers();
      setUnverifiedUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      showDialog(
        "Error",
        "Failed to fetch unverified users. Please try again.",
        "error"
      );
    }
  };

  const handleVerifyUser = async (email) => {
    setActionLoading(true);
    setverifyLoading(true);
    setCurrentAction(email);
    try {
      await verifyUser(email);
      setUnverifiedUsers((prev) => prev.filter((u) => u.email !== email));
      showDialog("Success", "User verified successfully!", "success");
    } catch (error) {
      console.error("Error verifying user:", error);
      showDialog("Error", "Failed to verify user. Please try again.", "error");
    } finally {
      setActionLoading(false);
      setverifyLoading(false);
      setCurrentAction(null);
    }
  };

  const handleRejectUser = async (email) => {
    showDialog(
      "Confirm Rejection",
      "Are you sure you want to reject this user? This action cannot be undone.",
      "confirm",
      true,
      async () => {
        closeDialog();
        setActionLoading(true);
        setrejectLoading(true);
        setCurrentAction(email);

        try {
          await rejectUser(email);
          setUnverifiedUsers((prev) => prev.filter((u) => u.email !== email));
          showDialog("Success", "User rejected successfully!", "success");
        } catch (error) {
          console.error("Error rejecting user:", error);
          showDialog(
            "Error",
            "Failed to reject user. Please try again.",
            "error"
          );
        } finally {
          setActionLoading(false);
          setrejectLoading(false);
          setCurrentAction(null);
        }
      }
    );
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getAdminStatus().then((res) => {
      if (!res.isAdmin) {
        navigate("/");
      } else {
        setAdminStatus(res);
        fetchUnverifiedUsers();
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="pt-20 bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex justify-center items-center">
        <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-lg">
          <FaSpinner className="animate-spin text-orange-500" size={24} />
          <span className="text-xl text-gray-600">
            Loading Admin Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="md:max-w-[90%] lg:max-w-[80%] mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                  <MdAdminPanelSettings className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage user verifications and system settings
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Pending Users
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">
                    {unverifiedUsers.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={
                      user.profilePicture?.url ||
                      "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    }
                    alt="Admin Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-1">
                    <FaCrown className="text-white" size={16} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <span>{user.fullName}</span>
                    <FaCrown
                      className={`${
                        adminStatus.role === "superadmin"
                          ? "text-orange-400"
                          : "text-blue-500"
                      }`}
                      size={20}
                    />
                  </h2>
                  <p className="text-gray-600 flex items-center space-x-1 mt-1">
                    <FaEnvelope size={14} />
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-green-100 to-green-200 px-4 py-2 rounded-full">
                  <span className="text-green-800 font-semibold flex items-center gap-2">
                    <MdVerifiedUser />
                    {adminStatus.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Users Section */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <MdPendingActions className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Pending User Verifications
                    </h2>
                    <p className="text-gray-600">
                      Review and approve new user registrations
                    </p>
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-lg">
                  <span className="text-orange-600 font-semibold">
                    {unverifiedUsers.length}{" "}
                    {unverifiedUsers.length === 1 ? "User" : "Users"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {unverifiedUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <FaUserCheck className="text-gray-400" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-gray-600">
                    No users pending verification at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unverifiedUsers.map((userItem) => (
                    <div
                      key={userItem._id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={
                                userItem.profilePicture?.url ||
                                "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                              }
                              alt="Profile"
                              className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                              <MdPendingActions
                                className="text-white"
                                size={12}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {userItem.fullName}
                              </h3>
                              <h3 className="text-md font-semibold text-orange-600">
                                @{userItem.username}
                              </h3>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center space-x-1">
                                <FaEnvelope size={12} />
                                <span>{userItem.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FaUsers size={12} />
                                <span>Roll: {userItem.rollNo}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FaCalendarAlt size={12} />
                                <span>
                                  Joined: {formatJoinDate(userItem.createdAt)}
                                </span>
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                Pending Verification
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3 lg:flex-shrink-0">
                          <button
                            onClick={() => handleVerifyUser(userItem.email)}
                            disabled={actionLoading}
                            className="flex items-center space-x-2 bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all transform hover:scale-105"
                          >
                            {verifyLoading &&
                            currentAction === userItem.email ? (
                              <>
                                <FaSpinner className="animate-spin" size={16} />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <FaUserCheck size={16} />
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectUser(userItem.email)}
                            disabled={actionLoading}
                            className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all transform hover:scale-105"
                          >
                            {rejectLoading &&
                            currentAction === userItem.email ? (
                              <>
                                <FaSpinner className="animate-spin" size={16} />
                                <span>Rejecting...</span>
                              </>
                            ) : (
                              <>
                                <FaUserTimes size={16} />
                                <span>Reject</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default AdminDashboard;
