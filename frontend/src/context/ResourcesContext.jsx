// frontend/src/context/ResourcesContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllResources, upvoteResource } from '../services/resourceApi';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const ResourcesContext = createContext();

export const useResources = () => {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourcesProvider');
  }
  return context;
};

export const ResourcesProvider = ({ children }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const fetchResources = useCallback(async (page, limit, category, search, adminOnly) => {
    setLoading(true);
    try {
      const response = await getAllResources(page, limit, category, search, adminOnly);
      setResources(response.resources || []);
      setPagination(response.pagination || {});
    } catch (error) {
      toast.error(error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpvote = useCallback(async (resourceId) => {
    if (!user) {
      toast.error('Please log in to upvote resources');
      return;
    }

    try {
      const response = await upvoteResource(resourceId);

      // Update the specific resource in the local state
      setResources(prevResources =>
        prevResources.map(res =>
          res._id === resourceId ? { ...res, upvotes: response.upvoters } : res
        )
      );

      // toast.success('Resource upvoted!');
    } catch (error) {
      toast.error(error.message || 'Failed to upvote resource');
    }
  }, [user]);

  const value = {
    resources,
    loading,
    pagination,
    fetchResources,
    handleUpvote,
    setResources, // Provide a setter for other components if needed
  };

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
};