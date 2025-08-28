import { api } from '../context/AuthContext';

// Function to fetch all approved resources with optional filtering and search
export const getAllResources = async (page = 1, limit = 10, category, search, adminOnly) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (adminOnly) params.append('adminOnly', true); // New: Append adminOnly param

    const response = await api.get(`/api/resources/get-all?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch resources';
  }
};

// Function to submit a new resource (for regular and admin users)
export const createResource = async (resourceData) => {
  try {
    const response = await api.post('/api/resources/create', resourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create resource';
  }
};

// Function to upvote a resource
export const upvoteResource = async (resourceId) => {
  try {
    const response = await api.post(`/api/resources/upvote/${resourceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to upvote resource';
  }
};

// Admin-only functions
export const getPendingResources = async () => {
  try {
    const response = await api.get('/api/resources/admin/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch pending resources';
  }
};

export const approveResource = async (resourceId) => {
  try {
    const response = await api.patch(`/api/resources/admin/approve/${resourceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to approve resource';
  }
};

export const rejectResource = async (resourceId) => {
  try {
    const response = await api.patch(`/api/resources/admin/reject/${resourceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to reject resource';
  }
};

export const updateResource = async (resourceId, resourceData) => {
  try {
    const response = await api.put(`/api/resources/edit/${resourceId}`, resourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update resource';
  }
};

export const deleteResource = async (resourceId) => {
  try {
    const response = await api.delete(`/api/resources/delete/${resourceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete resource';
  }
};