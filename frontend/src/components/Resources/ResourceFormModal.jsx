import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createResource, updateResource } from '../../services/resourceApi';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock';

const ResourceFormModal = ({ isOpen, onClose, onResourceCreated, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Career Guides',
    tags: '',
    thumbnail: '',
  });

  const isEditMode = !!initialData;
  const categories = ["Career Guides", "Roadmaps", "Playlists", "Notes & PYQs"];

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
      if (isEditMode) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          link: initialData.link || '',
          category: initialData.category || 'Career Guides',
          tags: initialData.tags ? initialData.tags.join(', ') : '',
          thumbnail: initialData.thumbnail || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          link: '',
          category: 'Career Guides',
          tags: '',
          thumbnail: '',
        });
      }
    } else {
      unlockBodyScroll();
    }
    return () => unlockBodyScroll();
  }, [isOpen, initialData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      };
      
      if (isEditMode) {
        await updateResource(initialData._id, payload);
        toast.success('Resource updated successfully!');
      } else {
        await createResource(payload);
        toast.success('Resource submitted for Approval!');
      }
      
      onClose();
      if (onResourceCreated) onResourceCreated();

    } catch (error) {
      console.error('Error submitting resource:', error);
      toast.error(error || 'Failed to submit resource.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white md:rounded-xl shadow-2xl w-full md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Resource' : 'Submit a New Resource for Approval'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-3 md:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link (URL)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., react, javascript, tutorial"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail URL (optional)</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  {/* <FaPlus /> */}
                  <span>{isEditMode ? 'Update Resource' : 'Submit Resource'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;