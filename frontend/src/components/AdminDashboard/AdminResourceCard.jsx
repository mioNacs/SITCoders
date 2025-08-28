import React, { useState } from "react";
import {
  FaUserCircle,
  FaStar,
  FaCheck,
  FaTimes,
  FaLink,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaRegStar,
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Dialog from "../UI/Dialog";
import {
  approveResource,
  rejectResource,
  deleteResource,
} from "../../services/resourceApi";
import ThumbnailViewModal from "../Resources/ThumbnailViewModal"; // Import the thumbnail modal

const AdminResourceCard = ({
  resource,
  onResourceUpdated,
  onResourceDeleted,
  onEditClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);

  const showDialog = (title, message, onConfirm) => {
    setDialog({ isOpen: true, title, message, onConfirm });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveResource(resource._id);
      toast.success("Resource approved successfully!");
      onResourceUpdated();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectResource(resource._id);
      toast.success("Resource rejected successfully!");
      onResourceUpdated();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteResource(resource._id);
      toast.success("Resource deleted successfully!");
      onResourceDeleted();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail Section */}
          <div
            className="flex-shrink-0 w-full md:w-48 cursor-pointer"
            onClick={() => setShowThumbnailModal(true)}
          >
            {resource.thumbnail ? (
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-36 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* Content & Info Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {resource.title}
              </h3>
            </div>

            <p className="text-sm sm:text-md text-gray-600 mt-2 mb-3">{resource.description}</p>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
              {resource.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:justify-between items-start md:items-center mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-start md:items-center gap-2 text-sm text-gray-500">
                {resource.author?.profilePicture?.url ? (
                  <img
                    src={resource.author.profilePicture.url}
                    alt="Author"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6 text-gray-400" />
                )}
                <Link
                  to={`/profile/${resource.author.username}`}
                  className={`hover:underline ${resource.createdByAdmin && "text-orange-500 font-semibold"}`}
                >
                  {resource.author.fullName || resource.author.username}
                </Link>
              </div>

              <div className="flex gap-2 items-center">
                {resource.approvedBy && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Approved by {resource.approvedBy.fullName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FaRegStar size={14} /> {(resource.upvotes || []).length}
                </span>
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

            {/* Admin Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              {resource.status === "pending" ? (
                <>
                  <button
                    onClick={() =>
                      showDialog(
                        "Approve Resource",
                        "Are you sure you want to approve this resource?",
                        handleApprove
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheck />
                    )}
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() =>
                      showDialog(
                        "Reject Resource",
                        "Are you sure you want to reject this resource? It will be permanently removed.",
                        handleReject
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTimes />
                    )}
                    <span>Reject</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    showDialog(
                      "Delete Resource",
                      "Are you sure you want to permanently delete this resource?",
                      handleDelete
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                  <span>Delete</span>
                </button>
              )}
              <button
                onClick={() => onEditClick(resource)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type="confirm"
        showConfirm={true}
        onConfirm={() => {
          dialog.onConfirm();
          closeDialog();
        }}
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

export default AdminResourceCard;
