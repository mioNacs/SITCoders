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
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasMore: false,
    totalPosts: 0
  });
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [tag, setTag] = useState('');

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
      setComments(prev => ({ ...prev, ...commentsMap }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments for some posts.");
    }
  }, []);

  const fetchPosts = useCallback(async (page = 1, limit = 15, currentTag, forceRefresh = false) => {
    if (loading || (hasFetched && !forceRefresh && currentTag === tag && pagination.currentPage === page)) {
      return;
    }
    setLoading(true);
    try {
      const data = await getAllPosts(page, limit, currentTag);
      setPosts(data.posts || []);
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        hasMore: data.pagination?.hasMore || false,
        totalPosts: data.pagination?.totalPosts || 0,
        currentPage: page,
      });
      setTag(currentTag);
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasFetched, tag, pagination.currentPage]);
  
  const changeFilterTag = useCallback((newTag, limit) => {
    setTag(newTag);
    setHasFetched(false);
    fetchPosts(1, limit, newTag, true);
  }, [fetchPosts]);

  const forceRefreshPosts = useCallback((page = 1, limit = 15, currentTag) => {
    setHasFetched(false);
    return fetchPosts(page, limit, currentTag, true);
  }, [fetchPosts]);

  const updatePosts = useCallback((newPosts) => { setPosts(newPosts); }, []);
  const updateSinglePost = useCallback((postId, updatedPost) => { setPosts(prev => prev.map(p => (p._id === postId ? { ...p, ...updatedPost, author: p.author } : p))); }, []);
  const removePost = useCallback((postId) => { setPosts(prev => prev.filter(p => p._id !== postId)); setComments(prev => { const newComments = { ...prev }; delete newComments[postId]; return newComments; }); }, []);
  const updateComments = useCallback((updater) => {
    setComments(prev => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return updater;
    });
  }, []);

  const value = {
    posts,
    comments,
    pagination,
    loading,
    hasFetched,
    tag,
    changeFilterTag,
    fetchPosts,
    forceRefreshPosts,
    updatePosts,
    updateSinglePost,
    removePost,
    updateComments,
    fetchCommentsForPosts
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};