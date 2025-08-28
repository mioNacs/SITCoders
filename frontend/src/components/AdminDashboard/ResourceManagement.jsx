import React, { useState, useEffect } from 'react';
import { FaSpinner, FaBookOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllResources, getPendingResources } from '../../services/resourceApi';
import AdminResourceCard from './AdminResourceCard';
import ResourceFormModal from '../Resources/ResourceFormModal';
import Dialog from '../UI/Dialog';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending', 'approved'
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const approvedResourcesData = await getAllResources();
      const pendingResourcesData = await getPendingResources();
      
      const approved = approvedResourcesData.resources || [];
      const pending = pendingResourcesData.resources || [];

      setPendingCount(pending.length);

      const allResources = [...pending, ...approved];

      if (activeFilter === 'pending') {
        setResources(pending);
      } else {
        setResources(approved);
      }
      
    } catch (error) {
      toast.error(error || 'Failed to fetch resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeFilter]);
  
  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setShowResourceModal(true);
  };
  
  const handleModalClose = () => {
    setEditingResource(null);
    setShowResourceModal(false);
  };
  
  const handleResourceUpdated = () => {
    handleModalClose();
    fetchResources();
  };
  
  const handleResourceDeleted = () => {
    fetchResources();
  };

  const filterButtonClasses = (filter) => 
    `flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      activeFilter === filter
        ? 'bg-orange-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-2 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center p-2 space-x-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <FaBookOpen className="text-orange-600" size={20} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Resource Management</h2>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 px-2 mb-6">
        <button className={filterButtonClasses('pending')} onClick={() => setActiveFilter('pending')}>Pending ({pendingCount})</button>
        <button className={filterButtonClasses('approved')} onClick={() => setActiveFilter('approved')}>Approved</button>
      </div>

      {loading ? (
        <div className="text-center py-12" aria-busy="true">
          <FaSpinner className="animate-spin text-orange-500 mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Resources Found</h3>
          <p className="text-gray-600">There are no resources to display in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <AdminResourceCard
              key={resource._id}
              resource={resource}
              onResourceUpdated={fetchResources}
              onResourceDeleted={handleResourceDeleted}
              onEditClick={handleEditClick}
            />
          ))}
        </div>
      )}
      
      <ResourceFormModal
        isOpen={showResourceModal}
        onClose={handleModalClose}
        onResourceCreated={handleResourceUpdated}
        initialData={editingResource}
      />
    </div>
  );
};

export default ResourceManagement;