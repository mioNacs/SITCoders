import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPosts, createPost, deletePost, editPost } from '../../../services/postApi';
import { getComments } from '../../../services/commentApi';
import { toast } from 'react-toastify';
import { useUrlPagination } from '../../../hooks/useUrlPagination';

export const useHomePosts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasMore: false,
    totalPosts: 0
  });

  const { currentPage, limit, goToPage } = useUrlPagination(1, 15);
  const allowedTags = ['general','query','announcement','event','project'];
  const searchParams = new URLSearchParams(location.search);
  const tagFromUrl = (searchParams.get('tag') || '').toLowerCase();
  const initialTag = allowedTags.includes(tagFromUrl) ? tagFromUrl : '';
  const [tag, setTag] = useState(initialTag);

  const fetchPosts = async (page = currentPage, activeTag = tag) => {
    try {
      setPostsLoading(true);
      const data = await getAllPosts(page, limit, activeTag || undefined);
      setPosts(data.posts || []);
      
      // Update pagination info
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        hasMore: data.pagination?.hasMore || false,
        totalPosts: data.pagination?.totalPosts || 0
      });
      
      if (data.posts && data.posts.length > 0) {
        fetchCommentsForPosts(data.posts.map(post => post._id));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again.");
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchCommentsForPosts = async (postIds) => {
    if (!postIds || postIds.length === 0) return;

    setCommentLoading(true);
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
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCreatePost = async (formData) => {
    try {
      await createPost(formData);
      // After creating a post, go back to first page to see the new post
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
      
      // Remove post from current posts
      setPosts(prevPosts => prevPosts.filter((post) => post._id !== postId));
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[postId];
        return newComments;
      });

      // If this was the only post on the current page and we're not on page 1,
      // go back to the previous page
      if (posts.length === 1 && currentPage > 1) {
        goToPage(currentPage - 1);
      } else {
        // Otherwise, refresh the current page to get accurate pagination
        fetchPosts(currentPage);
      }
      
      toast.success("Post deleted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
      return { success: false };
    }
  };

  const handleEditPost = async (postId, postData) => {
    try {
      const response = await editPost(postId, postData);
      
      // Update the post in the local state while preserving author info
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                content: postData.content,
                tag: postData.tag || post.tag,
                beenEdited: true,
                updatedAt: new Date().toISOString() 
              }
            : post
        )
      );
      
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
      getComments(postId)
        .then((data) => {
          setComments((prev) => ({
            ...prev,
            [postId]: data.parentComment || [],
          }));
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          toast.error("Failed to load comments. Please try again.");
        })
        .finally(() => {
          setCommentLoading(false);
        });
    }
  };

  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts(currentPage, tag);
  }, [currentPage, tag]);

  // Keep URL in sync when tag changes
  const updateTagInUrl = (newTag) => {
    const params = new URLSearchParams(location.search);
    if (newTag) params.set('tag', newTag); else params.delete('tag');
    // Reset to first page when tag changes
    params.delete('page');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const changeTag = (newTag) => {
    const normalized = (newTag || '').toLowerCase();
    if (normalized && !allowedTags.includes(normalized)) return;
    setTag(normalized);
    updateTagInUrl(normalized);
  };

  // Keep local tag state in sync if URL changes externally (e.g., back/forward)
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
    setComments,
    setCommentLoading,
    fetchPosts,
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