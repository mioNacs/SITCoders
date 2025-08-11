import React, { useState, useEffect } from 'react';
import { 
  FaUserCircle, 
  FaSpinner, 
  FaTrash, 
  FaEllipsisV, 
  FaComments, 
  FaArrowRight,
  FaClipboard,
  FaImage,
  FaTimes,
  FaExpand
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getUserPosts, deletePost, getPostsByUserId } from '../../services/postApi';
import { getComments } from '../../services/commentApi';
import { toast } from 'react-toastify';
import ViewPost from '../Home/ViewPost';
import { renderSafeMarkdown } from '../../utils/sanitize';

const PostsSection = ({ user, isOwnProfile = true }) => {
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(null);
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAllPostsModal, setShowAllPostsModal] = useState(false);
  const [allPostsLoading, setAllPostsLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchUserPosts();
    }
  }, [user, isOwnProfile]);

  const fetchUserPosts = async () => {
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
  };

  const fetchPostsByUserId = async (userId, page = 1, limit = 10) => {
    return await getPostsByUserId(userId, page, limit);
  };

  const fetchAllUserPosts = async (page = 1) => {
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
      setComments(prev => ({ ...prev, ...commentsMap }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    // Only allow deletion for own posts
    if (!isOwnProfile) {
      toast.error("You can only delete your own posts");
      return;
    }

    setDeleteLoading(postId);

    try {
      await deletePost(postId);

      // Remove post from both latest posts and all posts
      setPosts(posts.filter((post) => post._id !== postId));
      setAllPosts(allPosts.filter((post) => post._id !== postId));
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
      setDeleteLoading(null);
      setShowDeleteConfirm(null);
      setShowPostMenu(null);
    }
  };

  const handleShowComments = (postId) => {
    setShowComments(postId);
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

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
  };

  const getTagStyle = (tag) => {
    const styles = {
      query: "bg-blue-100 text-blue-600",
      project: "bg-green-100 text-green-600",
      announcement: "bg-red-100 text-red-600",
      event: "bg-purple-100 text-purple-600",
    };
    return styles[tag] || "bg-gray-100 text-gray-600";
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPostMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Check if current user can delete a specific post
  const canDeletePost = (post) => {
    return isOwnProfile && post.author?._id === authUser?._id;
  };

  const PostCard = ({ post, showMenu = true }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 transition-colors">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        {post.author?.profilePicture?.url ? (
          <img
            src={post.author.profilePicture.url}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-8 h-8 text-gray-400" />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 text-sm">
            {post.author?.fullName || post.author?.username || "User"}
          </h4>
          <p className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
            {post.beenEdited && <span className="ml-1">(Edited)</span>}
          </p>
        </div>
        {post.tag !== "general" && (
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getTagStyle(
              post.tag
            )}`}
          >
            {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
          </span>
        )}

        {/* Post Menu - only show for own posts */}
        {showMenu && canDeletePost(post) && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPostMenu(
                  showPostMenu === post._id ? null : post._id
                );
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaEllipsisV className="text-gray-500" size={12} />
            </button>

            {/* Dropdown Menu */}
            {showPostMenu === post._id && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(post._id);
                    setShowPostMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors text-xs"
                >
                  <FaTrash size={10} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content - Updated to handle rich text */}
      <div 
        className="text-gray-700 mb-3 text-sm whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ 
          __html: renderSafeMarkdown(post.content) 
        }}
      />

      {/* Post Image */}
      {post.postImage?.url && (
        <div className="mb-3">
          <img
            src={post.postImage.url}
            alt="Post"
            className="w-full object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-end gap-4 text-xs text-gray-500 border-t pt-2">
        <button 
          onClick={() => handleShowComments(post._id)}
          className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer bg-gray-50 p-1 px-3 rounded-lg"
        >
          <FaComments size={12} /> 
          <span>{comments[post._id]?.length || 0}</span>
          <FaArrowRight size={10} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md border border-orange-100 p-4">
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
      <div className="w-full bg-white rounded-lg shadow-md border border-orange-100 p-4">
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
                className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaExpand size={12} />
                <span>Show All</span>
              </button>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
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
              <PostCard key={post._id} post={post} showMenu={true} />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
                    <PostCard key={post._id} post={post} showMenu={true} />
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

      {/* Delete Confirmation Modal - Only show for own posts */}
      {showDeleteConfirm && isOwnProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FaTrash className="text-red-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Delete Post
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this post? This will permanently
                remove the post and all its content.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(showDeleteConfirm)}
                  disabled={deleteLoading === showDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading === showDeleteConfirm ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <ViewPost 
            posts={showAllPostsModal ? allPosts : posts}
            comments={comments}
            setComments={setComments}
            setShowComments={setShowComments}
            setCommentLoading={setCommentLoading}
            commentLoading={commentLoading}
            showComments={showComments}
          />
        </div>
      )}
    </>
  );
};

export default PostsSection;