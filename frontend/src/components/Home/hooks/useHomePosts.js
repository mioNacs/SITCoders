import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPost, deletePost, editPost } from '../../../services/postApi';
import { toast } from 'react-toastify';
import { useUrlPagination } from '../../../hooks/useUrlPagination';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostsContext';

export const useHomePosts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(null);
  
  const {
    posts,
    loading: postsLoading,
    comments,
    pagination,
    hasFetched,
    fetchPosts,
    forceRefreshPosts,
    updateSinglePost,
    removePost,
    setComments: updateComments,
    fetchCommentsForPosts,
    tag,
    changeFilterTag
  } = usePosts();

  const { currentPage, limit, goToPage } = useUrlPagination(1, 15);
  const { isSuspended } = useAuth();
  const allowedTags = ['general','query','announcement','event','project'];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagFromUrl = (searchParams.get('tag') || '').toLowerCase();
    
    if (!isSuspended) {
      // Always trigger a fetch based on the URL's state
      fetchPosts(currentPage, limit, tagFromUrl, !hasFetched);
    }
  }, [currentPage, location.search, isSuspended, hasFetched, fetchPosts, limit]);

  const changeTag = (newTag) => {
    const normalized = (newTag || '').toLowerCase();
    if (normalized !== tag) {
        changeFilterTag(normalized, limit);
        
        // Update URL to reflect the new state
        const params = new URLSearchParams(location.search);
        if (normalized) {
            params.set('tag', normalized);
        } else {
            params.delete('tag');
        }
        params.delete('page');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  };
  
  const handleCreatePost = async (formData) => {
    try {
      await createPost(formData);
      forceRefreshPosts(1, limit, tag); 
      goToPage(1);
      toast.success("Post created successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
      return { success: false };
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      removePost(postId);
      forceRefreshPosts(currentPage, limit, tag); 
      toast.success("Post deleted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
      return { success: false };
    }
  };

  const handleEditPost = async (postId, formData) => {
    try {
      const response = await editPost(postId, formData);
      updateSinglePost(postId, response.post);
      toast.success("Post updated successfully!");
      return { success: true, data: response };
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Failed to update post. Please try again.");
      return { success: false };
    }
  };
  
  const handleShowComments = (postId) => {
    setShowComments((prev) => (prev === postId ? null : postId));
    if (!comments[postId]) {
      setCommentLoading(true);
      fetchCommentsForPosts([postId])
        .finally(() => setCommentLoading(false));
    }
  };
  
  return {
    posts,
    postsLoading,
    comments,
    setComments: updateComments,
    commentLoading,
    showComments,
    setShowComments,
    handleCreatePost,
    handleDeletePost,
    handleEditPost,
    handleShowComments,
    pagination,
    currentPage,
    goToPage,
    tag,
    changeTag,
    allowedTags
  };
};