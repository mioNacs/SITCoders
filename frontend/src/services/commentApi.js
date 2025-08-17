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

export const updateComment = async (commentId, content) => {
  const tryJson = async (res) => {
    const text = await res.text();
    try { return JSON.parse(text); } catch { throw new Error(text || `HTTP ${res.status}`); }
  };
  try {
    let response = await fetch(`${API_BASE_URL}/comments/update-comment/${commentId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      // Some servers might not accept PUT or path differs; try POST fallback
      response = await fetch(`${API_BASE_URL}/comments/update-comment/${commentId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const data = await tryJson(response);
        throw new Error(data.message || 'Failed to update comment');
      }
    }
    return await tryJson(response);
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/delete-comment/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const adminDeleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/admin-delete-comment/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting comment (admin):', error);
    throw error;
  }
};