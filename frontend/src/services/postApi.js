import { api } from '../context/AuthContext';

export const createPost = async (formData) => {
  try {
    const response = await api.post('/api/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/posts/delete/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const editPost = async (postId, formData) => {
  try {
    const response = await api.put(`/api/posts/edit/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing post:', error);
    throw error;
  }
};

export const getAllPosts = async (page = 1, limit = 10, tag) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (tag) params.set('tag', tag);
    const response = await api.get(`/api/posts/get-posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getUserPosts = async (page = 1, limit = 10, tag) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (tag) params.set('tag', tag);
    const response = await api.get(`/api/posts/get-user-posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId, page = 1, limit = 10, tag) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (tag) params.set('tag', tag);
    const response = await api.get(`/api/posts/user/${userId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw error;
  }
};
