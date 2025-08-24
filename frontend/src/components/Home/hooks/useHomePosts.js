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
  
  // Use global posts context
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
    updateComments,
    fetchCommentsForPosts
  } = usePosts();

  const { currentPage, limit, goToPage } = useUrlPagination(1, 15);
  const allowedTags = ['general','query','announcement','event','project'];
  const searchParams = new URLSearchParams(location.search);
  const tagFromUrl = (searchParams.get('tag') || '').toLowerCase();
  const initialTag = allowedTags.includes(tagFromUrl) ? tagFromUrl : '';
  const [tag, setTag] = useState(initialTag);
  const {isSuspended, suspensionEnd} = useAuth()

  

  const handleCreatePost = async (formData) => {
    try {
      await createPost(formData);
      // After creating, force refresh posts for the first page
      await forceRefreshPosts(1, limit, tag);
      goToPage(1); // Also update the URL to page 1
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
      
      // Use context functions to update state
      removePost(postId);

      if (posts.length === 1 && currentPage > 1) {
        goToPage(currentPage - 1);
      } else {
        // Force refresh to get updated data
        await forceRefreshPosts(currentPage, limit, tag);
      }
      
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
      console.log("Edit post response:", response.post);

      // Update the post in the global context
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
      // Use the context function to fetch comments
      fetchCommentsForPosts([postId])
        .then(() => {
          setCommentLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          toast.error("Failed to load comments. Please try again.");
          setCommentLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!isSuspended && !hasFetched) {
      fetchPosts(currentPage, limit, tag);
    }
  }, [currentPage, tag, hasFetched, fetchPosts, limit, isSuspended]);

  const updateTagInUrl = (newTag) => {
    const params = new URLSearchParams(location.search);
    if (newTag) params.set('tag', newTag); else params.delete('tag');
    params.delete('page');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const changeTag = (newTag) => {
    const normalized = (newTag || '').toLowerCase();
    if (normalized && !allowedTags.includes(normalized)) return;
    setTag(normalized);
    updateTagInUrl(normalized);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTag = (params.get('tag') || '').toLowerCase();
    const normalized = allowedTags.includes(urlTag) ? urlTag : '';
    if (normalized !== tag) {
      setTag(normalized);
    }
  }, [location.search]);

  return {
    posts,
    postsLoading,
    comments,
    commentLoading,
    showComments,
    setShowComments,
    setCommentLoading,
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
