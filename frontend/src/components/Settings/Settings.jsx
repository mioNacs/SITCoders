import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiLock, 
  FiAlertTriangle,
  FiArrowLeft,
  FiSave
} from 'react-icons/fi';
import Dialog from '../UI/Dialog';

const Settings = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showDialog = (title, message, type = 'info') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      showDialog('Error', 'Please enter your password to confirm account deletion.', 'error');
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount(deletePassword);
      
      if (result.success) {
        showDialog('Success', 'Your account has been successfully deleted. You will be redirected to the home page.', 'success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        showDialog('Error', result.message, 'error');
      }
    } catch (error) {
      showDialog('Error', 'An error occurred while deleting your account. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="pt-16 pb-8 my-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Settings
                  </h2>
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('account')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'account'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiUser size={18} />
                      <span>Account</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('danger')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'danger'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiAlertTriangle size={18} />
                      <span>Danger Zone</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'account' && (
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {user?.fullName || 'Not provided'}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          @{user?.username || 'Not provided'}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {user?.email || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[80px]">
                          {user?.bio || 'No bio provided'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        To edit your profile information, go to your{' '}
                        <button
                          onClick={() => navigate('/profile')}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Profile page
                        </button>
                        .
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'danger' && (
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                      <FiAlertTriangle size={24} />
                      Danger Zone
                    </h3>
                    
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <FiTrash2 className="text-red-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-red-800 mb-2">
                            Delete Account
                          </h4>
                          <p className="text-red-700 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <ul className="text-sm text-red-600 mb-4 space-y-1">
                            <li>• All your posts will be deleted</li>
                            <li>• All your comments will be removed</li>
                            <li>• Your profile picture will be deleted</li>
                            <li>• You will lose access to your account immediately</li>
                          </ul>
                          
                          {!showDeleteConfirm ? (
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <FiTrash2 size={16} />
                              Delete My Account
                            </button>
                          ) : (
                            <div className="bg-white border border-red-300 rounded-lg p-4 mt-4">
                              <h5 className="font-medium text-red-800 mb-3">
                                Confirm Account Deletion
                              </h5>
                              <p className="text-sm text-red-700 mb-4">
                                Enter your password to confirm that you want to permanently delete your account.
                              </p>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-red-700 mb-2">
                                  Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none pr-12"
                                    placeholder="Enter your password"
                                    disabled={isDeleting}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeletePassword('');
                                  }}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                  disabled={isDeleting}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleDeleteAccount}
                                  disabled={isDeleting || !deletePassword.trim()}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {isDeleting ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <FiTrash2 size={16} />
                                      Confirm Delete
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
      />
    </div>
  );
};

export default Settings;
