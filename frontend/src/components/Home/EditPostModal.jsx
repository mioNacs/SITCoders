import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function EditPostModal({ isOpen, onClose, onSubmit, post, isAdmin }) {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with post data when modal opens
  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content || '');
      setTag(post.tag || 'general');
    }
  }, [isOpen, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    const postData = {
      content: content.trim(),
      tag
    };

    const result = await onSubmit(post._id, postData);
    if (result.success) {
      onClose();
      setContent('');
      setTag('general');
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setContent('');
      setTag('general');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Post</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Content */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              rows={6}
            />
          </div>

          {/* Tag Selection */}
          <div className="mb-6">
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
              Tag
            </label>
            <select
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="general">General</option>
              <option value="query">Query</option>
              <option value="project">Project</option>
              {isAdmin && (
                <>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                </>
              )}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
