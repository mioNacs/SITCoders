import { useState, useEffect } from 'react';
import { getAllPosts, createPost, deletePost } from '../../../services/postApi';
import { getComments } from '../../../services/commentApi';
import { toast } from 'react-toastify';

export const useHomePosts = () => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(null);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const data = await getAllPosts(1, 20);
      setPosts(data.posts || []);
      
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
      fetchPosts();
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
      setPosts(posts.filter((post) => post._id !== postId));
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[postId];
        return newComments;
      });
      toast.success("Post deleted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
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
    handleShowComments
  };
};