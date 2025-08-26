import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const UserSearchFilter = ({ 
  users, 
  onSearch, 
  onFilteredUsersChange, 
  placeholder = "Search by username, name, or email...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users;
  }, [users, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() && typeof onSearch === 'function') {
        handleSearch(searchTerm.trim());
      } else {
        onFilteredUsersChange && onFilteredUsersChange(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const results = await onSearch(query);
      onFilteredUsersChange && onFilteredUsersChange(results);
    } catch (e) {
      onFilteredUsersChange && onFilteredUsersChange([]);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div> : <FiSearch className="w-4 h-4 text-gray-400" />}
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
      
      {/* Results Counter (optional): removed for async search mode */}
    </div>
  );
};

export default UserSearchFilter;
