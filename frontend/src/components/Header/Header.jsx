import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated} = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="font-Jost fixed w-full top-0 z-50 bg-white border-b border-orange-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-2xl md:text-3xl text-gray-600 font-Saira font-bold">
              SIT
            </span>
            <span className="text-2xl md:text-3xl text-orange-400 font-Saira font-bold">
              Coders
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-orange-400 transition-colors duration-300"
            >
              {isMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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

          {/* Desktop navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex gap-4 justify-center text-lg">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-orange-400" : "text-gray-600"
                  } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/queries"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-orange-400" : "text-gray-600"
                  } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                }
              >
                Queries
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-orange-400" : "text-gray-600"
                  } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/contact-admin"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-orange-400" : "text-gray-600"
                  } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                }
              >
                Contact
              </NavLink>
            </div>
          )}

          {/* User profile/auth actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${
                      isActive ? "fill-orange-400" : "fill-gray-600"
                    } hover:fill-orange-400 transition-colors duration-300 ease-in-out`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="34px"
                  >
                    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                  </svg>
                </NavLink>
              </>
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
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-orange-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `block px-3 py-2 ${
                      isActive ? "text-orange-400" : "text-gray-600"
                    } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                  }
                  onClick={toggleMenu}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/queries"
                  className={({ isActive }) =>
                    `block px-3 py-2 ${
                      isActive ? "text-orange-400" : "text-gray-600"
                    } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                  }
                  onClick={toggleMenu}
                >
                  Queries
                </NavLink>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `block px-3 py-2 ${
                      isActive ? "text-orange-400" : "text-gray-600"
                    } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                  }
                  onClick={toggleMenu}
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/contact-admin"
                  className={({ isActive }) =>
                    `block px-3 py-2 ${
                      isActive ? "text-orange-400" : "text-gray-600"
                    } hover:text-orange-400 transition-colors duration-300 ease-in-out`
                  }
                  onClick={toggleMenu}
                >
                  Contact Admin
                </NavLink>
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2"
                  onClick={toggleMenu}
                >
                  <span className="hover:text-orange-400 transition-colors duration-300 ease-in-out">
                    Profile
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    className="hover:fill-orange-400 transition-colors duration-300 ease-in-out"
                  >
                    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                  </svg>
                </NavLink>
              </>
            ) : (
              <div className="space-y-2 px-3 py-2">
                <Link
                  to="/login"
                  className="block text-gray-600 hover:text-orange-400 transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-center"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
