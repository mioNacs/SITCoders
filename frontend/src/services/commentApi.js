import { api } from '../context/AuthContext';

export const createComment = async (postId, content) => {
  try {
    const response = await api.post(`/api/comments/create/${postId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const createReply = async (commentId, content) => {
  try {
    const response = await api.post(`/api/comments/reply/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const response = await api.post(`/api/comments/get-comments/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`/api/comments/update-comment/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/delete-comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const adminDeleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/admin-delete-comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment (admin):', error);
    throw error;
  }
};