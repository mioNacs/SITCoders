import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchUsersByUsername } from '../../services/api';
import { FaUser } from 'react-icons/fa6';

const UserSearch = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Don't render if user is not authenticated
  if (!isAuthenticated) return null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      setIsLoading(true);
      const response = await searchUsersByUsername(query);
      setSearchResults(response.user || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative hidden md:block" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Search users..."
          className="w-64 px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((user) => (
                <li key={user._id}>
                  <button
                    onClick={() => handleUserClick(user.username)}
                    className="w-full px-4 py-2 text-left cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {user.profilePicture.url ? (
                        <img
                        src={user.profilePicture.url || '/default-avatar.png'}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      ): 
                      <FaUser/>
                      }
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          @{user.username}
                        </div>
                      </div>
                      {user.popularity > 0 && (
                        <div className="text-xs text-orange-500 font-medium">
                          {user.popularity} pts
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="px-4 py-3 text-center text-gray-500">
              No users found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
