import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiLogOut, FiShield, FiShare2 } from 'react-icons/fi';

const ActionButtons = ({ user, isAdmin, onLogout, showDialog }) => {
  
  const handleLogoutClick = () => {
    showDialog(
      "Confirm Logout", 
      "Are you sure you want to logout?", 
      "confirm", 
      true, 
      onLogout
    );
  };

  return (
      <div className="flex gap-2">
        {isAdmin && (
          <Link
            to="/admin-dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-orange-400 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-500 transition-all duration-200 shadow-sm"
          >
            <FiShield size={14} />
            <span>Admin Panel</span>
          </Link>
        )}
        
        <button
          className={`${isAdmin ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-gray-500 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-600 transition-all duration-200 shadow-sm cursor-pointer`}
          onClick={handleLogoutClick}
        >
          <FiLogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
  );
};

export default ActionButtons;