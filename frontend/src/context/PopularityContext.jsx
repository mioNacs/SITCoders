/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { togglePostPopularity, toggleProfilePopularity as toggleProfilePopularityAPI, toggleCommentPopularity as toggleCommentPopularityAPI, getUserReputation, getLeaderboard} from '../services/popularityApi';
import { toast } from 'react-toastify';

const PopularityContext = createContext(null);

export const usePopularity = () => {
  const ctx = useContext(PopularityContext);
  if (!ctx) throw new Error('usePopularity must be used within PopularityProvider');
  return ctx;
};

export const PopularityProvider = ({ children }) => {
  // Global state for post popularity
  // Structure: { [postId]: { popularity: [userId1, userId2, ...], count: number, isLiked: boolean } }
  const [postPopularity, setPostPopularity] = useState({});
  
  // Global state for profile popularity
  // Structure: { [profileId]: { popularity: [userId1, userId2, ...], count: number, isLiked: boolean } }
  const [profilePopularity, setProfilePopularity] = useState({});
  
  // Global state for comment popularity
  // Structure: { [commentId]: { popularity: [userId1, userId2, ...], count: number, isLiked: boolean } }
  const [commentPopularity, setCommentPopularity] = useState({});
  
  // Global state for user reputation
  // Structure: { [userId]: { totalReputation: number, profilePopularity: number, totalPostsPopularity: number, totalCommentsPopularity: number, ... } }
  const [userReputation, setUserReputation] = useState({});

  // Global state for leaderboard
  // Structure: leaderboard: [ { userId, fullName, username, profilePicture, totalReputation, ... }, ... ]
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);

  // Fetch leaderboard from backend
  const fetchLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const response = await getLeaderboard();
      if (response && Array.isArray(response.leaderboard)) {
        setLeaderboard(response.leaderboard);
      } else {
        setLeaderboard([]);
        setLeaderboardError('No leaderboard data found');
      }
    } catch (error) {
      setLeaderboard([]);
      setLeaderboardError(error.message || 'Failed to fetch leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);
  
  // Pending requests to avoid duplicate API calls
  const pendingRequests = useRef(new Set());
  
  // Initialize or update post popularity data (only if not already initialized)
  const initializePostPopularity = useCallback((postId, popularityArray, currentUserId) => {
    const count = popularityArray?.length || 0;
    const isLiked = popularityArray?.includes(currentUserId) || false;
    
    setPostPopularity(prev => {
      // Don't overwrite existing data - only initialize if it doesn't exist
      if (prev[postId]) {
        return prev; // Keep existing data
      }
      
      return {
        ...prev,
        [postId]: {
          popularity: popularityArray || [],
          count,
          isLiked
        }
      };
    });
  }, []);

  // Update multiple posts at once (useful for feed updates) - only for new posts
  const initializeMultiplePostsPopularity = useCallback((posts, currentUserId) => {
    const updates = {};
    posts.forEach(post => {
      const count = post.popularity?.length || 0;
      const isLiked = post.popularity?.includes(currentUserId) || false;
      updates[post._id] = {
        popularity: post.popularity || [],
        count,
        isLiked
      };
    });
    
    setPostPopularity(prev => {
      const newState = { ...prev };
      // Only add posts that don't already exist in the state
      Object.keys(updates).forEach(postId => {
        if (!newState[postId]) {
          newState[postId] = updates[postId];
        }
      });
      return newState;
    });
  }, []);

  // Force update post popularity data (useful for server sync)
  const forceUpdatePostPopularity = useCallback((postId, popularityArray, currentUserId) => {
    const count = popularityArray?.length || 0;
    const isLiked = popularityArray?.includes(currentUserId) || false;
    
    setPostPopularity(prev => ({
      ...prev,
      [postId]: {
        popularity: popularityArray || [],
        count,
        isLiked
      }
    }));
  }, []);

  // Smart toggle function with LinkedIn-like behavior
  const togglePopularity = useCallback(async (postId, currentUserId) => {
    // Prevent duplicate requests
    const requestKey = `${postId}-${currentUserId}`;
    if (pendingRequests.current.has(requestKey)) {
      return;
    }

    const currentState = postPopularity[postId];
    if (!currentState) {
      console.warn(`Post ${postId} not initialized in popularity context`);
      return;
    }

    const { isLiked, popularity, count } = currentState;
    
    // LinkedIn-like behavior logic:
    // - If currently liked: remove from frontend immediately, call backend to unlike
    // - If currently not liked: add to frontend immediately, call backend to like
    // - If user tries to like an already liked post: frontend only (no backend call)
    // - If user tries to unlike a not-liked post: frontend only (no backend call)
    
    // Always do optimistic update first
    const newIsLiked = !isLiked;
    const newPopularity = newIsLiked 
      ? [...popularity, currentUserId]
      : popularity.filter(id => id !== currentUserId);
    const newCount = Math.max(0, newIsLiked ? count + 1 : count - 1); // Prevent negative counts

    // Update UI immediately
    setPostPopularity(prev => ({
      ...prev,
      [postId]: {
        popularity: newPopularity,
        count: newCount,
        isLiked: newIsLiked
      }
    }));

    // Always make backend call - let backend handle the actual logic
    try {
      pendingRequests.current.add(requestKey);
      const response = await togglePostPopularity(postId);
      
      // Backend should return the updated popularity array and count
      if (
        response &&
        Array.isArray(response.popularityArray) &&
        typeof response.popularity === 'number'
      ) {
        const serverPopularityArray = response.popularityArray;
        const serverCount = response.popularity;
        const actualIsLiked = serverPopularityArray.includes(currentUserId);

        setPostPopularity(prev => ({
          ...prev,
          [postId]: {
            popularity: serverPopularityArray,
            count: serverCount,
            isLiked: actualIsLiked
          }
        }));
      }
    } catch (error) {
      // Revert optimistic update on error
      setPostPopularity(prev => ({
        ...prev,
        [postId]: {
          popularity,
          count,
          isLiked
        }
      }));
      
      toast.error('Failed to update popularity. Please try again.');
      console.error('Error toggling popularity:', error);
    } finally {
      pendingRequests.current.delete(requestKey);
    }
  }, [postPopularity]);

  // Get popularity data for a specific post
  const getPostPopularityData = useCallback((postId) => {
    return postPopularity[postId] || { popularity: [], count: 0, isLiked: false };
  }, [postPopularity]);

  // Check if a post is liked by current user
  const isPostLiked = useCallback((postId) => {
    return postPopularity[postId]?.isLiked || false;
  }, [postPopularity]);

  // Get popularity count for a post
  const getPopularityCount = useCallback((postId) => {
    return postPopularity[postId]?.count || 0;
  }, [postPopularity]);

  // === PROFILE POPULARITY FUNCTIONS ===

  // Initialize or update profile popularity data (only if not already initialized)
  const initializeProfilePopularity = useCallback((profileId, popularityArray, currentUserId) => {
    const count = popularityArray?.length || 0;
    const isLiked = popularityArray?.includes(currentUserId) || false;
    
    setProfilePopularity(prev => {
      // Don't overwrite existing data - only initialize if it doesn't exist
      if (prev[profileId]) {
        return prev; // Keep existing data
      }
      
      return {
        ...prev,
        [profileId]: {
          popularity: popularityArray || [],
          count,
          isLiked
        }
      };
    });
  }, []);

  // Smart toggle function for profiles
  const toggleProfilePopularity = useCallback(async (profileId, currentUserId) => {
    // Prevent duplicate requests
    const requestKey = `profile-${profileId}-${currentUserId}`;
    if (pendingRequests.current.has(requestKey)) {
      return;
    }

    const currentState = profilePopularity[profileId];
    if (!currentState) {
      console.warn(`Profile ${profileId} not initialized in popularity context`);
      return;
    }

    const { isLiked, popularity, count } = currentState;
    
    // Optimistic update - always update UI first
    const newIsLiked = !isLiked;
    const newPopularity = newIsLiked 
      ? [...popularity, currentUserId]
      : popularity.filter(id => id !== currentUserId);
    const newCount = Math.max(0, newIsLiked ? count + 1 : count - 1); // Prevent negative counts

    // Update UI immediately
    setProfilePopularity(prev => ({
      ...prev,
      [profileId]: {
        popularity: newPopularity,
        count: newCount,
        isLiked: newIsLiked
      }
    }));

    // Always make backend call - let backend handle the actual logic
    try {
      pendingRequests.current.add(requestKey);
      const response = await toggleProfilePopularityAPI(profileId);
      
      // Sync with server response - this is the source of truth
      if (response && typeof response.popularity === 'number') {
        const serverCount = response.popularity;
        
        // The backend already handles the toggle logic correctly
        // So we just need to sync our local state with the server response
        const isNowLiked = serverCount > count; // If count increased from original, it's liked
        
        setProfilePopularity(prev => ({
          ...prev,
          [profileId]: {
            popularity: isNowLiked 
              ? [...popularity.filter(id => id !== currentUserId), currentUserId]
              : popularity.filter(id => id !== currentUserId),
            count: serverCount,
            isLiked: isNowLiked
          }
        }));
      }
    } catch (error) {
      // Revert optimistic update on error
      setProfilePopularity(prev => ({
        ...prev,
        [profileId]: {
          popularity,
          count,
          isLiked
        }
      }));
      
      toast.error('Failed to update profile popularity. Please try again.');
      console.error('Error toggling profile popularity:', error);
    } finally {
      pendingRequests.current.delete(requestKey);
    }
  }, [profilePopularity]);

  // Get popularity data for a specific profile
  const getProfilePopularityData = useCallback((profileId) => {
    return profilePopularity[profileId] || { popularity: [], count: 0, isLiked: false };
  }, [profilePopularity]);

  // Check if a profile is liked by current user
  const isProfileLiked = useCallback((profileId) => {
    return profilePopularity[profileId]?.isLiked || false;
  }, [profilePopularity]);

  // Get popularity count for a profile
  const getProfilePopularityCount = useCallback((profileId) => {
    return profilePopularity[profileId]?.count || 0;
  }, [profilePopularity]);

  // === COMMENT POPULARITY FUNCTIONS ===

  // Initialize or update comment popularity data (only if not already initialized)
  const initializeCommentPopularity = useCallback((commentId, popularityArray, currentUserId) => {
    const count = popularityArray?.length || 0;
    const isLiked = popularityArray?.includes(currentUserId) || false;
    
    setCommentPopularity(prev => {
      // Don't overwrite existing data - only initialize if it doesn't exist
      if (prev[commentId]) {
        return prev; // Keep existing data
      }
      
      return {
        ...prev,
        [commentId]: {
          popularity: popularityArray || [],
          count,
          isLiked
        }
      };
    });
  }, []);

  // Initialize multiple comments at once (useful for comment feeds)
  const initializeMultipleCommentsPopularity = useCallback((comments, currentUserId) => {
    const updates = {};
    comments.forEach(comment => {
      const count = comment.popularity?.length || 0;
      const isLiked = comment.popularity?.includes(currentUserId) || false;
      updates[comment._id] = {
        popularity: comment.popularity || [],
        count,
        isLiked
      };
    });
    
    setCommentPopularity(prev => {
      const newState = { ...prev };
      // Only add comments that don't already exist in the state
      Object.keys(updates).forEach(commentId => {
        if (!newState[commentId]) {
          newState[commentId] = updates[commentId];
        }
      });
      return newState;
    });
  }, []);

  // Smart toggle function for comments
  const toggleCommentPopularity = useCallback(async (commentId, currentUserId) => {
    // Prevent duplicate requests
    const requestKey = `comment-${commentId}-${currentUserId}`;
    if (pendingRequests.current.has(requestKey)) {
      return;
    }

    const currentState = commentPopularity[commentId];
    if (!currentState) {
      console.warn(`Comment ${commentId} not initialized in popularity context`);
      return;
    }

    const { isLiked, popularity, count } = currentState;
    
    // Optimistic update - always update UI first
    const newIsLiked = !isLiked;
    const newPopularity = newIsLiked 
      ? [...popularity, currentUserId]
      : popularity.filter(id => id !== currentUserId);
    const newCount = Math.max(0, newIsLiked ? count + 1 : count - 1); // Prevent negative counts

    // Update UI immediately
    setCommentPopularity(prev => ({
      ...prev,
      [commentId]: {
        popularity: newPopularity,
        count: newCount,
        isLiked: newIsLiked
      }
    }));

    // Always make backend call - let backend handle the actual logic
    try {
      pendingRequests.current.add(requestKey);
      const response = await toggleCommentPopularityAPI(commentId);
      
      // Sync with server response - this is the source of truth
      if (response && typeof response.popularity === 'number') {
        const serverCount = response.popularity;
        
        // The backend already handles the toggle logic correctly
        // So we just need to sync our local state with the server response
        const isNowLiked = serverCount > count; // If count increased from original, it's liked
        
        setCommentPopularity(prev => ({
          ...prev,
          [commentId]: {
            popularity: isNowLiked 
              ? [...popularity.filter(id => id !== currentUserId), currentUserId]
              : popularity.filter(id => id !== currentUserId),
            count: serverCount,
            isLiked: isNowLiked
          }
        }));
      }
    } catch (error) {
      // Revert optimistic update on error
      setCommentPopularity(prev => ({
        ...prev,
        [commentId]: {
          popularity,
          count,
          isLiked
        }
      }));
      
      toast.error('Failed to update comment popularity. Please try again.');
      console.error('Error toggling comment popularity:', error);
    } finally {
      pendingRequests.current.delete(requestKey);
    }
  }, [commentPopularity]);

  // Get popularity data for a specific comment
  const getCommentPopularityData = useCallback((commentId) => {
    return commentPopularity[commentId] || { popularity: [], count: 0, isLiked: false };
  }, [commentPopularity]);

  // Check if a comment is liked by current user
  const isCommentLiked = useCallback((commentId) => {
    return commentPopularity[commentId]?.isLiked || false;
  }, [commentPopularity]);

  // Get popularity count for a comment
  const getCommentPopularityCount = useCallback((commentId) => {
    return commentPopularity[commentId]?.count || 0;
  }, [commentPopularity]);

  // ===== REPUTATION FUNCTIONS =====
  
  // Fetch and cache user reputation
  const fetchUserReputation = useCallback(async (userId) => {
    try {
      // Check if we already have fresh data (within last 5 minutes)
      const existingData = userReputation[userId];
      if (existingData && existingData.calculatedAt) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const dataTime = new Date(existingData.calculatedAt);
        if (dataTime > fiveMinutesAgo) {
          return existingData;
        }
      }

      // Prevent duplicate requests
      const requestKey = `reputation-${userId}`;
      if (pendingRequests.current.has(requestKey)) {
        return existingData;
      }

      pendingRequests.current.add(requestKey);

      const response = await getUserReputation(userId);
      
      if (response && response.reputation) {
        setUserReputation(prev => ({
          ...prev,
          [userId]: response.reputation
        }));
        
        return response.reputation;
      }

    } catch (error) {
      console.error('Error fetching user reputation:', error);
      toast.error('Failed to load reputation');
    } finally {
      pendingRequests.current.delete(`reputation-${userId}`);
    }
  }, [userReputation]);

  // Get cached reputation data
  const getUserReputationData = useCallback((userId) => {
    return userReputation[userId] || null;
  }, [userReputation]);

  // Get total reputation score
  const getTotalReputation = useCallback((userId) => {
    return userReputation[userId]?.totalReputation || 0;
  }, [userReputation]);

  // Get reputation breakdown
  const getReputationBreakdown = useCallback((userId) => {
    const data = userReputation[userId];
    if (!data) return null;
    
    return {
      profilePopularity: data.profilePopularity || 0,
      postsPopularity: data.totalPostsPopularity || 0,
      commentsPopularity: data.totalCommentsPopularity || 0,
      totalPosts: data.totalPosts || 0,
      totalComments: data.totalComments || 0,
      avgPostPopularity: data.avgPostPopularity || 0,
      avgCommentPopularity: data.avgCommentPopularity || 0
    };
  }, [userReputation]);

  // Refresh reputation data (force fetch)
  const refreshUserReputation = useCallback(async (userId) => {
    // Remove cached data to force fresh fetch
    setUserReputation(prev => {
      const newState = { ...prev };
      delete newState[userId];
      return newState;
    });
    
    return await fetchUserReputation(userId);
  }, [fetchUserReputation]);

  const value = {
    // Post State
    postPopularity,
    
    // Post Actions
    initializePostPopularity,
    initializeMultiplePostsPopularity,
    forceUpdatePostPopularity,
    togglePopularity,
    
    // Post Getters
    getPostPopularityData,
    isPostLiked,
    getPopularityCount,

    // Profile State
    profilePopularity,

    // Profile Actions
    initializeProfilePopularity,
    toggleProfilePopularity,

    // Profile Getters
    getProfilePopularityData,
    isProfileLiked,
    getProfilePopularityCount,

    // Comment State
    commentPopularity,

    // Comment Actions
    initializeCommentPopularity,
    initializeMultipleCommentsPopularity,
    toggleCommentPopularity,

    // Comment Getters
    getCommentPopularityData,
    isCommentLiked,
    getCommentPopularityCount,

  // Reputation State
  userReputation,

  // Reputation Actions
  fetchUserReputation,
  refreshUserReputation,

  // Reputation Getters
  getUserReputationData,
  getTotalReputation,
  getReputationBreakdown,

  // Leaderboard State
  leaderboard,
  leaderboardLoading,
  leaderboardError,

  // Leaderboard Actions
  fetchLeaderboard,
  };

  return (
    <PopularityContext.Provider value={value}>
      {children}
    </PopularityContext.Provider>
  );
};
