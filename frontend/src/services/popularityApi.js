const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Toggle popularity (like/unlike) on a post
 * @param {string} postId - The ID of the post to like/unlike
 * @returns {Promise<Object>} Response containing message and popularity count
 */
export const togglePostPopularity = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/popularity/add-popularity/${postId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update post popularity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling post popularity:', error);
    throw error;
  }
};

/**
 * Toggle popularity (like/unlike) on a user profile
 * @param {string} profileId - The ID of the profile to like/unlike
 * @returns {Promise<Object>} Response containing message and popularity count
 */
export const toggleProfilePopularity = async (profileId) => {
  try {
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/popularity/add-popularity/profile/${profileId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile popularity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling profile popularity:', error);
    throw error;
  }
};

/**
 * Toggle popularity (like/unlike) on a comment
 * @param {string} commentId - The ID of the comment to like/unlike
 * @returns {Promise<Object>} Response containing message and popularity count
 */
export const toggleCommentPopularity = async (commentId) => {
  try {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/popularity/add-popularity/comment/${commentId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update comment popularity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling comment popularity:', error);
    throw error;
  }
};

/* Leaderboard API endpoint removed until backend implementation is ready */

/**
 * Get user reputation (sum of profile, posts, and comments popularity)
 * @param {string} userId - The ID of the user to get reputation for
 * @returns {Promise<Object>} Response containing detailed reputation data
 */
export const getUserReputation = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/popularity/reputation/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get user reputation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user reputation:', error);
    throw error;
  }
};
/**
 * Fetch the top 20 users by reputation (leaderboard)
 * @returns {Promise<Object>} Response containing leaderboard array
 */
export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/popularity/leaderboard`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch leaderboard');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}