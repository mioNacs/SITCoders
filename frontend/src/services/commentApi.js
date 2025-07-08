const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createComment = async (postId, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/create/${postId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const createReply = async (commentId, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/reply/${commentId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create reply');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/get-comments/${postId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch comments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};