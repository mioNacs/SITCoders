// frontend/src/components/Resources/ResourceCard.jsx
import React, { useState } from "react";
import {
  FaUserCircle,
  FaStar,
  FaLink,
  FaEdit,
  FaTrash,
  FaRegStar,
  FaShare,
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import {deleteResource} from "../../services/resourceApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useResources } from "../../context/ResourcesContext"; // New import
import ResourceDeleteModal from "./ResourceDeleteModal";
import ThumbnailViewModal from "./ThumbnailViewModal";
import ShareResourceButton from "./ShareResourceButton";

const ResourceCard = ({ resource, onEdit, onDelete, onShare }) => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { handleUpvote } = useResources();
  const upvoters = resource.upvotes || [];
  const isUpvoted = user && upvoters.includes(user._id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);

  const isAuthor = user && resource.author._id === user._id;
  const canModify = isAuthor || isAdmin;

  const onUpvoteClick = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to upvote");
      return;
    }
    await handleUpvote(resource._id);
  };

  const handleDelete = async () => {
    try {
      await deleteResource(resource._id);
      toast.success("Resource deleted successfully!");
      if (onDelete) onDelete();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 flex flex-col gap-4">
        {/* Thumbnail Section */}
        <div
          className="flex-shrink-0 w-full cursor-pointer"
          onClick={() => setShowThumbnailModal(true)}
        >
          {resource.thumbnail ? (
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-48  bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {resource.title}
                </h3>
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

            <p className="text-sm sm:text-md text-gray-600 mb-3">
              {resource.description}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
              {resource.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2  items-start mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to={`/profile/${resource.author.username}`}>
                {resource.author?.profilePicture?.url ? (
                  <img
                    src={resource.author.profilePicture.url}
                    alt="Author"
                    className="w-6 h-6 rounded-full hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6 text-gray-400" />
                )}
                </Link>
                <div className="flex flex-col">
                  <Link to={`/profile/${resource.author.username}`}>
                  <span className={`hover:underline ${resource.createdByAdmin && "text-orange-500 font-semibold"}`}>
                  {resource.author.fullName || resource.author.username}
                  </span>
                  </Link>
                  {resource.approvedBy && (
                    <span className="text-green-800 text-xs font-medium rounded-full">
                      Approved by {resource.approvedBy.fullName}
                    </span>
                  )}
                </div>
              </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={onUpvoteClick}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors
                  ${
                    isUpvoted
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {isUpvoted ? <FaStar size={14} /> : <FaRegStar size={14} />}
                <span className="text-sm font-medium">{upvoters.length}</span>
              </button>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaLink size={14} /> <span>View</span>
              </a>
              <ShareResourceButton resource={resource} onShare={onShare} />
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
