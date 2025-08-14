import { useNavigate } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiSettings, FiLogOut, FiX } from 'react-icons/fi';

const MobileMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/')
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-600 hover:text-orange-400 transition-colors duration-300 p-2"
        >
          {isMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 transition-opacity"
            onClick={closeMenu}
          />
          
          {/* Slide-in Menu */}
          <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-1">
                <span className="text-xl text-gray-600 font-Saira font-bold">SIT</span>
                <span className="text-xl text-orange-400 font-Saira font-bold">Coders</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 py-2">
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-lg ${
                          isActive 
                            ? "text-orange-400 bg-orange-50 border-r-2 border-orange-400" 
                            : "text-gray-700 hover:text-orange-400 hover:bg-gray-50"
                        } transition-all duration-200`
                      }
                      onClick={closeMenu}
                    >
                      Home
                    </NavLink>
                    
                    <NavLink
                      to="/Resources"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-lg ${
                          isActive 
                            ? "text-orange-400 bg-orange-50 border-r-2 border-orange-400" 
                            : "text-gray-700 hover:text-orange-400 hover:bg-gray-50"
                        } transition-all duration-200`
                      }
                      onClick={closeMenu}
                    >
                      Resources
                    </NavLink>
                    
                    <NavLink
                      to="/Collaborate"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-lg ${
                          isActive 
                            ? "text-orange-400 bg-orange-50 border-r-2 border-orange-400" 
                            : "text-gray-700 hover:text-orange-400 hover:bg-gray-50"
                        } transition-all duration-200`
                      }
                      onClick={closeMenu}
                    >
                      Collaborate
                    </NavLink>
                    
                    <NavLink
                      to="/contact-admin"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-lg ${
                          isActive 
                            ? "text-orange-400 bg-orange-50 border-r-2 border-orange-400" 
                            : "text-gray-700 hover:text-orange-400 hover:bg-gray-50"
                        } transition-all duration-200`
                      }
                      onClick={closeMenu}
                    >
                      Contact Admin
                    </NavLink>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Profile Actions */}
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-lg ${
                          isActive 
                            ? "text-orange-400 bg-orange-50 border-r-2 border-orange-400" 
                            : "text-gray-700 hover:text-orange-400 hover:bg-gray-50"
                        } transition-all duration-200`
                      }
                      onClick={closeMenu}
                    >
                      <FiUser size={20} />
                      Profile
                    </NavLink>
                    
                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-lg ${
                          isActive 
                            ? "text-orange-400 bg-orange-50 border-r-2 border-orange-400" 
                            : "text-gray-700 hover:text-orange-400 hover:bg-gray-50"
                        } transition-all duration-200`
                      }
                      onClick={closeMenu}
                    >
                      <FiSettings size={20} />
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-lg text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiLogOut size={20} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 p-4">
                  <Link
                    to="/login"
                    className="text-center py-3 text-lg text-gray-600 hover:text-orange-400 transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center bg-orange-400 hover:bg-orange-500 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
