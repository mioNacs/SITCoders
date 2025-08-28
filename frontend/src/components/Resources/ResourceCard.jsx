import React, { useState } from 'react';
import { FaUserCircle, FaStar, FaLink, FaEdit, FaTrash } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { upvoteResource, deleteResource } from '../../services/resourceApi';
import ResourceDeleteModal from './ResourceDeleteModal';
import ThumbnailViewModal from './ThumbnailViewModal'; // New component import

const ResourceCard = ({ resource, onUpvote, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(resource.upvotes);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false); // New state for thumbnail modal

  const isAuthor = user && resource.author._id === user._id;
  const canModify = isAuthor || isAdmin;

  const handleUpvote = async () => {
    try {
      await upvoteResource(resource._id);
      setUpvoteCount(prev => prev + 1);
      if (onUpvote) onUpvote();
    } catch (error) {
      toast.error('Failed to upvote resource');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResource(resource._id);
      toast.success('Resource deleted successfully!');
      if (onDelete) onDelete();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row gap-4">
        {/* Thumbnail Section */}
        <div 
          className="flex-shrink-0 w-full md:w-56 cursor-pointer"
          onClick={() => setShowThumbnailModal(true)}
        >
          {resource.thumbnail ? (
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-32 md:h-full object-cover rounded-lg hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-32 md:h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{resource.title}</h3>
              </div>
              {canModify && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(resource)}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                    title="Edit Resource"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Delete Resource"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm sm:text-md text-gray-600 mb-3">{resource.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
              {resource.tags.map(tag => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:justify-between items-start md:items-center mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-start md:items-center gap-2 text-sm text-gray-500">
              {resource.author?.profilePicture?.url ? (
                <img src={resource.author.profilePicture.url} alt="Author" className="w-6 h-6 rounded-full" />
              ) : (
                <FaUserCircle className="w-6 h-6 text-gray-400" />
              )}
              <Link to={`/profile/${resource.author.username}`} className={`hover:underline ${resource.createdByAdmin && "text-orange-500 font-semibold"}`}>
                {resource.author.fullName || resource.author.username}
              </Link>
            </div>
            
            <div className="flex gap-2 items-center">
              {resource.approvedBy && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Approved by {resource.approvedBy.fullName}</span>
              )}
              <button
                  onClick={handleUpvote}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
              >
                  <FaStar size={14} />
                  <span className="text-sm font-medium">{upvoteCount}</span>
              </button>
              <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                  <FaLink size={14} /> View
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <ResourceDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        resourceId={resource._id}
      />
      {resource.thumbnail && (
        <ThumbnailViewModal 
          isOpen={showThumbnailModal}
          onClose={() => setShowThumbnailModal(false)}
          thumbnailUrl={resource.thumbnail}
          title={resource.title}
        />
      )}
    </>
  );
};

export default ResourceCard;