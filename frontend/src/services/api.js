import { api } from '../context/AuthContext';

// Posts API
export const getAllPosts = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/api/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/api/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Comments API
export const getComments = async (postId) => {
  try {
    const response = await api.get(`/api/comments/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await api.post('/api/comments', commentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin API
export const checkAdminStatus = async () => {
  try {
    const response = await api.get('/api/admin/status');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (userId) => {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/verify`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unverifyUser = async (userId) => {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/unverify`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Profile API  
export const getUser = async (username) => {
  try {
    const response = await api.post('/api/users/get-user', {username});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Real-time User Search API
export const searchUsersByUsername = async (username) => {
  try {
    const response = await api.post('/api/users/search-users-by-username', { username });
    return response.data;
  } catch (error) {
    throw error;
  }
};

