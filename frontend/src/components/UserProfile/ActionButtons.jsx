import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const ActionButtons = ({ isAdmin, onLogout, showDialog }) => {
  
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
    <div className="absolute right-4 top-4 flex flex-col gap-2 items-end">
      {isAdmin && (
        <Link
          to="/admin-dashboard"
          className="flex gap-2 items-center bg-orange-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors cursor-pointer"
        >
          <MdOutlineAdminPanelSettings size={20} />
          <span className="font-medium">Admin Dashboard</span>
        </Link>
      )}
      <button
        className="flex gap-2 items-center bg-red-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
        onClick={handleLogoutClick}
      >
        <FaSignOutAlt size={14} />
        <span className="font-medium">Log out</span>
      </button>
    </div>
  );
};

export default ActionButtons;