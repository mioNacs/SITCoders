import React, { useState, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const UserSearchFilter = ({ 
  users, 
  onFilteredUsersChange, 
  placeholder = "Search by username, name, or email...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return users.filter(user => {
      // Search in username
      if (user.username && user.username.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in fullName
      if (user.fullName && user.fullName.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in email
      if (user.email && user.email.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [users, searchTerm]);

  // Call the callback when filtered users change
  React.useEffect(() => {
    if (onFilteredUsersChange) {
      onFilteredUsersChange(filteredUsers);
    }
  }, [filteredUsers, onFilteredUsersChange]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Results Counter */}
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          {filteredUsers.length === 0 ? (
            <span className="text-red-500">No users found matching "{searchTerm}"</span>
          ) : (
            <span>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              {filteredUsers.length < users.length && ` (filtered from ${users.length})`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchFilter;
