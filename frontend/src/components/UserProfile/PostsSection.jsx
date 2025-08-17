import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaUserCircle, 
  FaSpinner, 
  FaClipboard,
  FaTimes,
  FaBan,
  FaExpand
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getUserPosts, deletePost, getPostsByUserId, editPost } from '../../services/postApi';
import { getComments } from '../../services/commentApi';
import { toast } from 'react-toastify';
import ViewPost from '../Home/ViewPost';
import PostCard from '../Home/PostCard';
// PostCard uses shared formatters internally
// Edit/Delete modals are centralized in PostUIContext
import { usePostUI } from '../../context/PostUIContext';
import { useCommentsUI } from '../../context/CommentsUIContext';
// PostUIProvider is provided at App level

const PostsSection = ({ user, isOwnProfile = true }) => {
  const { isSuspended, suspensionEnd, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Post menu handled by PostUIProvider
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const { showCommentsPostId, openComments, closeComments } = useCommentsUI();
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAllPostsModal, setShowAllPostsModal] = useState(false);
  const [allPostsLoading, setAllPostsLoading] = useState(false);
  const { registerEditHandler, registerDeleteHandler } = usePostUI();

  // Fetch latest user posts when identity or suspension changes
  useEffect(() => {
    if (user?._id && !isSuspended) {
      fetchUserPosts();
    } else {
      setLoading(false);
    }
  }, [user?._id, isOwnProfile, isSuspended]);

  const fetchUserPosts = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      
      let data;
      if (isOwnProfile) {
        // Use existing API for own profile
        data = await getUserPosts(1, 1); // Get only the latest post
      } else {
        // For other users' profiles, we need a new API endpoint
        // For now, we'll use a workaround - you should create a new API endpoint
        data = await fetchPostsByUserId(user._id, 1, 1);
      }
      
      setPosts(data.posts || []);
      setTotalPosts(data.totalPosts || 0);
      
      // Fetch comments for the latest post
      if (data.posts && data.posts.length > 0) {
        fetchCommentsForPosts(data.posts.map(post => post._id));
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [user?._id, isOwnProfile]);

  const fetchPostsByUserId = useCallback(async (userId, page = 1, limit = 10) => {
    return await getPostsByUserId(userId, page, limit);
  }, []);

  const fetchAllUserPosts = useCallback(async (page = 1) => {
    if (!user?._id) return;

    try {
      setAllPostsLoading(true);
      
      let data;
      if (isOwnProfile) {
        data = await getUserPosts(page, 10); // Get all posts with pagination
      } else {
        data = await fetchPostsByUserId(user._id, page, 10);
      }
      
      if (page === 1) {
        setAllPosts(data.posts || []);
      } else {
        setAllPosts(prev => [...prev, ...(data.posts || [])]);
      }
      
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      
      // Fetch comments for all posts
      if (data.posts && data.posts.length > 0) {
        fetchCommentsForPosts(data.posts.map(post => post._id));
      }
    } catch (error) {
      console.error('Error fetching all user posts:', error);
      toast.error('Failed to load all posts');
    } finally {
      setAllPostsLoading(false);
    }
  }, [user?._id, isOwnProfile, fetchPostsByUserId]);

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
      setComments(prev => ({ ...prev, ...commentsMap }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = React.useCallback(async (postId) => {
    // Only allow deletion for own posts
    if (!isOwnProfile && !isAdmin) {
      toast.error("You can only delete your own posts");
      return;
    }

    try {
      await deletePost(postId);

      // Remove post from both latest posts and all posts
      setPosts(prevPosts => prevPosts.filter((post) => post._id !== postId));
      setAllPosts(prevAllPosts => prevAllPosts.filter((post) => post._id !== postId));
      setTotalPosts(prev => prev - 1);

      // Remove comments for this post
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[postId];
        return newComments;
      });

      toast.success('Post deleted successfully!');
      
      // If we deleted the only latest post, fetch the next latest
      if (posts.length === 1 && totalPosts > 1) {
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      // menu closes via provider; delete modal is centralized
    }
  }, [isOwnProfile, isAdmin, posts.length, totalPosts]);

  const handleShowComments = (postId) => {
    openComments(postId);
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
          console.error('Error fetching comments:', error);
          toast.error('Failed to load comments');
        })
        .finally(() => {
          setCommentLoading(false);
        });
    }
  };

  const handleShowAllPosts = () => {
    setShowAllPostsModal(true);
    if (allPosts.length === 0) {
      fetchAllUserPosts(1);
    }
  };

  const handleLoadMorePosts = () => {
    if (currentPage < totalPages) {
      fetchAllUserPosts(currentPage + 1);
    }
  };

  // formatters imported from utils

  // Menu + permissions handled by PostUIProvider/PostMenu

  const handleEditConfirm = useCallback(
    async (postId, postData) => {
      try {
        const res = await editPost(postId, postData);
        const updated = res.post || res.updatedPost || {};

        setPosts(prev => prev.map(p => {
          if (p._id !== postId) return p;
          const next = { ...p, ...updated };
          const ua = updated.author;
          const incomplete = !ua || typeof ua !== 'object' || !ua.fullName;
          if (incomplete) next.author = p.author;
          return next;
        }));

        setAllPosts(prev => prev.map(p => {
          if (p._id !== postId) return p;
          const next = { ...p, ...updated };
          const ua = updated.author;
          const incomplete = !ua || typeof ua !== 'object' || !ua.fullName;
          if (incomplete) next.author = p.author;
          return next;
        }));

        toast.success(res.message || 'Post updated');
        return { success: true };
      } catch (e) {
        toast.error(e.message || 'Failed to update post');
        return { success: false, message: e.message };
      }
    },
    []
  );

  // Register global handlers
  useEffect(() => {
    const unregister = registerEditHandler(async (postId, postData) => handleEditConfirm(postId, postData));
    return unregister;
  }, [registerEditHandler, handleEditConfirm]);

  useEffect(() => {
    const unregister = registerDeleteHandler(async (postId) => handleDeletePost(postId));
    return unregister;
  }, [registerDeleteHandler, handleDeletePost]);

  // Use shared Home/PostCard to avoid duplication

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg border border-orange-100 p-4">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 border-b border-orange-200 pb-2">
          {isOwnProfile ? 'Your Posts' : `${user?.fullName}'s Posts`}
        </h2>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-orange-500 mr-2" size={24} />
          <span className="text-gray-600">Loading posts...</span>
        </div>
      </div>
    );
  }

  return (
  <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 border-b border-orange-200 pb-2">
          <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <FaClipboard />
            {isOwnProfile ? 'Your Posts' : `${user?.fullName}'s Posts`}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {totalPosts} post{totalPosts !== 1 ? 's' : ''}
            </span>
            {totalPosts > 1 && (
              <button
                onClick={handleShowAllPosts}
                className="flex items-center gap-2 px-3 py-1 text-md bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors cursor-pointer"
              >
                <FaExpand size={12} />
                <span>Show All</span>
              </button>
            )}
          </div>
        </div>

        {isSuspended ? (
          <>
          <div className="flex font-Saira flex-col items-center justify-center h-64 text-orange-700">
            <FaBan size={48} className="mb-4" />
            <p className="text-lg font-bold text-center">This account is suspended <br />
              {suspensionEnd && (
                <span className='text-md font-medium'>
                  <span> </span>until {new Date(suspensionEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </p>
            <p className="text-sm text-center">
              {isOwnProfile
                ? "You can't use this website while your account is suspended."
                : "This user is currently suspended and cannot post."
              }
            </p>
          </div>
          </>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FaClipboard size={48} className="mb-4" />
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">
              {isOwnProfile 
                ? "Share your thoughts with the community!" 
                : "This user hasn't posted anything yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                comments={comments}
                onShowComments={handleShowComments}
              />
            ))}
            {totalPosts > 1 && (
              <div className="text-center pt-2 border-t">
                <p className="text-sm text-gray-500 mb-2">
                  Showing latest post • {totalPosts - 1} more post{totalPosts === 2 ? '' : 's'} available
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* All Posts Modal */}
      {showAllPostsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaClipboard className="text-orange-500" />
                {isOwnProfile ? `All Your Posts (${totalPosts})` : `All ${user?.fullName}'s Posts (${totalPosts})`}
              </h3>
              <button
                onClick={() => setShowAllPostsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {allPostsLoading && allPosts.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <FaSpinner className="animate-spin text-orange-500 mr-2" size={24} />
                  <span className="text-gray-600">Loading all posts...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {allPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      comments={comments}
                      onShowComments={handleShowComments}
                    />
                  ))}
                  
                  {/* Load More Button */}
                  {currentPage < totalPages && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleLoadMorePosts}
                        disabled={allPostsLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {allPostsLoading ? (
                          <>
                            <FaSpinner className="animate-spin" size={14} />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <span>Load More Posts</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

  {/* Edit/Delete modals are rendered by PostUIProvider */}

      {/* Comments Modal */}
  {showCommentsPostId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <ViewPost 
            posts={showAllPostsModal ? allPosts : posts}
            comments={comments}
            setComments={setComments}
    setShowComments={closeComments}
            commentLoading={commentLoading}
    showComments={showCommentsPostId}
          />
        </div>
      )}
  </>
  );
};

export default PostsSection;