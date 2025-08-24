/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllPosts } from '../services/postApi';
import { getComments } from '../services/commentApi';
import { toast } from 'react-toastify';

const PostsContext = createContext(null);

export const usePosts = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
};

export const PostsProvider = ({ children }) => {
  // State for posts data
  const [posts, setPosts] = useState([]);
  
  // State for comments associated with posts
  const [comments, setComments] = useState({});
  
  // State for pagination details
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasMore: false,
    totalPosts: 0
  });
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Track if initial data load has occurred
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch posts function with forceRefresh parameter
  const fetchPosts = useCallback(async (page = 1, limit = 15, tag, forceRefresh = false) => {
    // Return early if loading or if already fetched and not forcing refresh
    if (loading || (hasFetched && !forceRefresh)) {
      return;
    }

    try {
      setLoading(true);
      const data = await getAllPosts(page, limit, tag);
      
      setPosts(data.posts || []);
      
      // Update pagination info
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        hasMore: data.pagination?.hasMore || false,
        totalPosts: data.pagination?.totalPosts || 0
      });
      
      // Fetch comments for posts if posts exist
      if (data.posts && data.posts.length > 0) {
        await fetchCommentsForPosts(data.posts.map(post => post._id));
      }
      
      // Mark as fetched upon successful fetch
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasFetched]);

  // Fetch comments for posts
  const fetchCommentsForPosts = useCallback(async (postIds) => {
    if (!postIds || postIds.length === 0) return;

    try {
      const allComments = await Promise.all(
        postIds.map((postId) => getComments(postId))
      );
      
      const commentsMap = {};
      allComments.forEach((data, index) => {
        commentsMap[postIds[index]] = data.parentComment || [];
      });
      
      setComments(commentsMap);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments. Please try again.");
    }
  }, []);

  // Force refresh posts by resetting hasFetched and calling fetchPosts
  const forceRefreshPosts = useCallback((page = 1, limit = 15, tag) => {
    setHasFetched(false);
    return fetchPosts(page, limit, tag, true);
  }, [fetchPosts]);

  // Update posts state directly (useful for optimistic updates)
  const updatePosts = useCallback((newPosts) => {
    setPosts(newPosts);
  }, []);

  // Update a single post (useful for edit operations)
  const updateSinglePost = useCallback((postId, updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, ...updatedPost, author: post.author } // Keep old author field
          : post
      )
    );
  }, []);

  // Remove a post (useful for delete operations)
  const removePost = useCallback((postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    
    // Also remove comments for this post
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[postId];
      return newComments;
    });
  }, []);

  // Update comments for a specific post
  const updateComments = useCallback((postId, newComments) => {
    setComments(prev => ({
      ...prev,
      [postId]: newComments
    }));
  }, []);

  // Set comments loading state
  const setCommentsLoading = useCallback((loading) => {
    // This can be extended if needed for global comment loading state
  }, []);

  const value = {
    // State
    posts,
    comments,
    pagination,
    loading,
    hasFetched,
    
    // Actions
    fetchPosts,
    forceRefreshPosts,
    updatePosts,
    updateSinglePost,
    removePost,
    updateComments,
    setCommentsLoading,
    fetchCommentsForPosts
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};
