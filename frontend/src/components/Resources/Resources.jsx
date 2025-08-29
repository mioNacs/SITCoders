// frontend/src/components/Resources/Resources.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaSearch, FaTimes, FaUserShield } from 'react-icons/fa';
import ResourceCard from './ResourceCard';
import ResourceFormModal from './ResourceFormModal';
import Pagination from '../UI/Pagination';
import ShareResourceModal from './ShareResourceModal'; // Import the new modal
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourcesContext'; // Updated import
import { toast } from 'react-toastify';
import { getAllResources } from '../../services/resourceApi'; // Re-added for local fetch within this file

function Resources() {
  const { user, isAuthenticated, isSuspended } = useAuth();
  const { resources, loading, pagination, fetchResources, handleUpvote } = useResources();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingResource, setEditingResource] = useState(null);
  const [adminOnly, setAdminOnly] = useState(false);
  const [sharingResource, setSharingResource] = useState(null); // State for the share modal
  
  const { currentPage, goToPage } = useUrlPagination();

  const categories = ["All", "Career Guides", "Roadmaps", "Playlists", "Notes & PYQs"];

  const fetchResourcesWithParams = async (page = 1, limit = 10) => {
    // This is now an internal function to call the context's fetch method
    await fetchResources(
      page,
      limit,
      activeCategory !== 'All' ? activeCategory : null,
      submittedSearchQuery || null,
      adminOnly
    );
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchResourcesWithParams(currentPage);
  }, [isAuthenticated, currentPage, activeCategory, submittedSearchQuery, adminOnly]);

  const handlePageChange = (newPage) => {
    goToPage(newPage);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    goToPage(1);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearchQuery(searchQuery);
    goToPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSubmittedSearchQuery('');
    goToPage(1);
  };

  const handleResourceCreated = () => {
    fetchResourcesWithParams(currentPage);
    setEditingResource(null);
  };
  
  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setShowSubmitModal(true);
  };
  
  const handleModalClose = () => {
    setEditingResource(null);
    setShowSubmitModal(false);
  };

  const handleAdminOnlyToggle = (e) => {
    setAdminOnly(e.target.checked);
  };

  const handleShareResource = (resource) => {
    setSharingResource(resource);
  };


  if (!isAuthenticated) {
    return (
      <div className='pt-20 h-screen bg-orange-50'>
        <div className='md:max-w-[90%] h-full xl:max-w-[80%] mx-auto flex items-center justify-center'>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Please Login First
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              You need to be logged in to view our resources.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='pt-16 min-h-screen bg-orange-50'>
      <div className='md:max-w-[90%] xl:max-w-[80%] mx-auto px-4 md:px-0 py-8'>
        {/* Header and Submission button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-600">Resources</h1>
          {!isSuspended && user.isAdminVerified && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FaPlus />
              Submit Resource
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filters */}
            <div className="flex-1 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {/* Checkbox for Admin Resources */}
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200">
                <input
                  type="checkbox"
                  checked={adminOnly}
                  onChange={handleAdminOnlyToggle}
                  className="form-checkbox text-orange-500"
                />
                <FaUserShield className="text-gray-600" />
                <span className="text-gray-600">Admin Resources</span>
              </label>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-auto">
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
            </form>
          </div>
        </div>

        {/* Resource List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-orange-500" size={32} />
            <span className="ml-4 text-gray-600">Loading resources...</span>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onUpvote={() => handleUpvote(resource._id)}
                onEdit={handleEditClick}
                onShare={handleShareResource} // Pass the share handler
                onDelete={() => fetchResourcesWithParams(currentPage)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <h2 className="text-2xl font-bold mb-2">No Resources Found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Pagination */}
        {resources.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasMore={pagination.hasMore}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Resource Submission Modal */}
      <ResourceFormModal
        isOpen={showSubmitModal}
        onClose={handleModalClose}
        onResourceCreated={handleResourceCreated}
        initialData={editingResource}
      />

      <ShareResourceModal
        isOpen={!!sharingResource}
        onClose={() => setSharingResource(null)}
        resource={sharingResource}
      />
    </div>
  );
}

export default Resources;