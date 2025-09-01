import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LandingHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-Saira text-2xl font-bold text-gray-800">
              SIT<span className="text-orange-500">Coders</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-500 transition-colors">
              Features
            </a>
            <a href="#developers" className="text-gray-600 hover:text-orange-500 transition-colors">
              Developers
            </a>
            <a href="#updates" className="text-gray-600 hover:text-orange-500 transition-colors">
              Updates
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/home"
                className="px-5 py-2 text-base font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-base font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-base font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;
