import React, { useState } from 'react';
import { FaTimes, FaImage, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CreatePostModal = ({ isOpen, onClose, onSubmit, isAdmin }) => {
  const [newPost, setNewPost] = useState({
    content: "",
    tag: "general",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const getAvailableTags = () => {
    const baseTags = [
      { value: "general", label: "General" },
      { value: "query", label: "Query" },
      { value: "project", label: "Project" },
    ];

    const adminTags = [
      { value: "announcement", label: "Announcement" },
      { value: "event", label: "Event" },
    ];

    return isAdmin ? [...baseTags, ...adminTags] : baseTags;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setNewPost({ ...newPost, image: file });

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPost({ ...newPost, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.content.trim()) {
      toast.warning("Please add some content to your post");
      return;
    }

    if (["announcement", "event"].includes(newPost.tag) && !isAdmin) {
      toast.error("Only administrators can create announcements and events");
      return;
    }

    setCreateLoading(true);

    const formData = new FormData();
    formData.append("content", newPost.content);
    formData.append("tag", newPost.tag);

    if (newPost.image) {
      formData.append("postImage", newPost.image);
    }

    const result = await onSubmit(formData);
    
    if (result.success) {
      setNewPost({ content: "", tag: "general", image: null });
      setImagePreview(null);
      onClose();
    }

    setCreateLoading(false);
  };

  const handleClose = () => {
    setNewPost({ content: "", tag: "general", image: null });
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              Create New Post
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Content Textarea */}
          <div className="mb-4">
            <textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 resize-none outline-none"
              rows="10"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Image Upload */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                  <FaImage className="text-gray-600" />
                  <span className="text-sm text-gray-600">Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Tag Selection */}
            <div className="mb-4">
              <select
                value={newPost.tag}
                onChange={(e) =>
                  setNewPost({ ...newPost, tag: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-500 focus:border-orange-400 outline-none"
              >
                {getAvailableTags().map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={createLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading || !newPost.content.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;