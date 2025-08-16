import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiSettings, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';

const UserActions = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div className="hidden md:flex items-center space-x-4">
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {user?.profilePicture.url? (
                <img
                    src={user.profilePicture.url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                />
                ) : (
                <FaRegUserCircle size={32} 
                className="text-gray-600" 
                />
            )}

            <FiChevronDown 
              size={16} 
              className={`text-gray-600 transition-transform duration-200 ${
                isProfileDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Desktop Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
              
              <NavLink
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <FiUser size={16} />
                Profile
              </NavLink>
              
              <NavLink
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <FiSettings size={16} />
                Settings
              </NavLink>

              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link
            to="/login"
            className="text-gray-600 hover:text-orange-400 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserActions;
