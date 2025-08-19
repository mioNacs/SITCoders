/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { togglePostPopularity } from '../services/popularityApi';
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

  const value = {
    // State
    postPopularity,
    
    // Actions
    initializePostPopularity,
    initializeMultiplePostsPopularity,
    forceUpdatePostPopularity,
    togglePopularity,
    
    // Getters
    getPostPopularityData,
    isPostLiked,
    getPopularityCount,
  };

  return (
    <PopularityContext.Provider value={value}>
      {children}
    </PopularityContext.Provider>
  );
};
