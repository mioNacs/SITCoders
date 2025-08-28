import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaSpinner, FaSearch, FaTimes } from 'react-icons/fa';
import { getResourcesByUserId } from '../../services/resourceApi';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourcesContext';
import ResourceCard from '../Resources/ResourceCard';
import Pagination from '../UI/Pagination';
import { useUrlPagination } from '../../hooks/useUrlPagination';

const ResourcesSection = ({ user, isOwnProfile, onEdit }) => {
  const { isAuthenticated, isSuspended } = useAuth();
  const { resources, loading, pagination, setResources } = useResources();
  const [localLoading, setLocalLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const { currentPage, goToPage } = useUrlPagination();

  const fetchUserResources = async (page = currentPage, limit = 10, search = submittedSearchQuery) => {
    if (!user?._id) return;
    setLocalLoading(true);
    try {
      const data = await getResourcesByUserId(user._id, page, limit, search);
      setResources(data.resources);
      // Assuming `setPagination` is also available through context or handled in another way
    } catch (error) {
      console.error("Error fetching user resources:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isSuspended) {
      fetchUserResources();
    }
  }, [user?._id, isAuthenticated, isSuspended, currentPage, submittedSearchQuery]);
  
  const handlePageChange = (newPage) => {
    goToPage(newPage);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearchQuery(searchQuery);
    goToPage(1); // Reset to page 1 on new search
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSubmittedSearchQuery('');
    goToPage(1);
  };

  if (!user) {
    return null;
  }

  const isLoading = localLoading;

  return (
    <div className={`w-full ${isLoading? "bg-white rounded-lg p-4 border border-orange-100 ": "" }`}>
      <div className="flex items-center justify-between mb-4 border-b border-orange-200 pb-2">
        <h2 className="text-lg md:text-2xl font-bold text-orange-600 flex items-center gap-2">
          {!isLoading  && <FaBookOpen />}
          {isOwnProfile ? 'Your Resources' : `${user?.fullName}'s Resources`}
        </h2>
        <span className="text-sm text-gray-500">
          {!isLoading && `${resources.length || 0} resource${pagination.totalResources !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Search Bar for User Resources */}
      {!isLoading && <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FaSearch />
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </form>}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-orange-500 mr-2" size={24} />
          <span className="text-gray-600">Loading resources...</span>
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} onEdit={onEdit} />
          ))}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <FaBookOpen size={48} className="mb-4" />
          <p className="text-lg font-medium">No resources yet</p>
          <p className="text-sm">
            {isOwnProfile 
              ? "Share useful resources with the community!" 
              : "This user hasn't shared any resources yet."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourcesSection;