import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { usePopularity } from "../../context/PopularityContext";
import { verifyIsAdmin } from "../../services/adminApi";
import { useHomePosts } from "./hooks/useHomePosts";
import CreatePostButton from "./CreatePostButton";
import CreatePostModal from "./CreatePostModal";
import PostsFeed from "./PostsFeed";
import Sidebar from "./Sidebar";
// Edit/Delete modals are centralized in PostUIContext
import { usePostUI } from "../../context/PostUIContext";
import ViewPost from "./ViewPost";
import Pagination from "../UI/Pagination";
// formatters are consumed inside PostCard; no need to import here
import { useCommentsUI } from "../../context/CommentsUIContext";
// PostUIProvider is provided at App level

function Home() {
  const { user, isAuthenticated, isLoading: authLoading, isSuspended } = useAuth();
  const { initializeMultiplePostsPopularity } = usePopularity();
  const { registerEditHandler, registerDeleteHandler } = usePostUI();
  const {
    posts,
    postsLoading,
    comments,
    commentLoading,
    setComments,
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
  } = useHomePosts();

  // Centralized comments UI
  const { showCommentsPostId, openComments, closeComments } = useCommentsUI();

  // Admin status state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // Modal states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  // Edit/Delete are handled globally by PostUIProvider modals

  // Check admin status and initialize popularity data
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user?.email) {
        setAdminLoading(false);
        return;
      }

      try {
        const adminStatus = await verifyIsAdmin(user.email);
        setIsAdmin(adminStatus.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };
    
    if (isAuthenticated) {
      // No need to call fetchPosts here since useHomePosts handles it via useEffect
    }
    checkAdminStatus();
  }, [isAuthenticated, user]);

  // Initialize popularity data when posts are loaded
  useEffect(() => {
    if (posts.length > 0 && user?._id) {
      initializeMultiplePostsPopularity(posts, user._id);
    }
  }, [posts, user?._id, initializeMultiplePostsPopularity]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTagDropdown && !event.target.closest('[data-dropdown="tag-selector"]')) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTagDropdown]);

  // Permissions centralized in PostUIProvider

  // Register global handlers for Edit/Delete modals
  useEffect(() => {
    const unregister = registerEditHandler(async (postId, postData) => {
      return await handleEditPost(postId, postData);
    });
    return unregister;
  }, [registerEditHandler, handleEditPost]);

  useEffect(() => {
    const unregister = registerDeleteHandler(async (postId) => {
      return await handleDeletePost(postId);
    });
    return unregister;
  }, [registerDeleteHandler, handleDeletePost]);

  // formatDate & getTagStyle imported from utils/formatters

  // Calculate user's post count
  const userPostsCount = posts.filter((post) => post.author?._id === user._id).length;

  // Show loading screen while auth is being checked
  if (authLoading) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-orange-500" size={32} />
          <span className="mt-4 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="post-container">
      <div className="pt-20 min-h-screen bg-orange-50">
        <div className="flex flex-col md:flex-row gap-6 md:max-w-[90%] lg:max-w-[80%] mx-0 md:mx-auto md:pb-8">
          {/* Main Content Area */}
          <div className="md:w-2/3 h-full flex flex-col gap-4">
            <CreatePostButton 
              user={user} 
              onCreatePost={() => setShowCreatePost(true)} 
            />

            {/* Tag Filter - Responsive */}
            { !isSuspended && (
              <>
                {/* Desktop Version - Buttons */}
                <div className="hidden md:flex flex-wrap px-3 py-3 md:py-0 border-y md:border-none border-gray-300 bg-white md:bg-white/0 items-center gap-2">
                  <button
                    className={`px-3 py-1 rounded-full text-md border transition cursor-pointer ${!tag ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => changeTag('')}
                  >
                    All
                  </button>
                  {allowedTags.map(t => (
                    <button
                      key={t}
                      className={`px-3 py-1 rounded-full text-md capitalize border transition cursor-pointer ${tag === t ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => changeTag(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Mobile Version - Dropdown */}
                <div className="md:hidden ml-auto px-3 w-1/2 border-gray-300 relative" data-dropdown="tag-selector">
                  <button
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                  >
                    <span className="capitalize">
                      {tag || 'All'}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${showTagDropdown ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showTagDropdown && (
                    <div className="absolute top-full left-3 right-3 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <button
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg ${!tag ? 'bg-orange-50 text-orange-600' : ''}`}
                        onClick={() => {
                          changeTag('');
                          setShowTagDropdown(false);
                        }}
                      >
                        All
                      </button>
                      {allowedTags.map(t => (
                        <button
                          key={t}
                          className={`w-full px-4 py-2 text-left capitalize hover:bg-gray-50 last:rounded-b-lg ${tag === t ? 'bg-orange-50 text-orange-600' : ''}`}
                          onClick={() => {
                            changeTag(t);
                            setShowTagDropdown(false);
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <PostsFeed
              posts={posts}
              postsLoading={postsLoading}
              comments={comments}
              onShowComments={(postId)=>{ openComments(postId); handleShowComments(postId); }}
            />

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              hasMore={pagination.hasMore}
              onPageChange={goToPage}
              loading={postsLoading}
              className="mb-6"
            />
          </div>

          <Sidebar
            user={user}
            isAdmin={isAdmin}
            adminLoading={adminLoading}
            userPostsCount={userPostsCount}
            onCreatePost={() => setShowCreatePost(true)}
          />
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        isAdmin={isAdmin}
      />

  {/* Edit/Delete modals are rendered by PostUIProvider */}

  {showCommentsPostId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <ViewPost 
            posts={posts}
            comments={comments}
            setComments={setComments}
    setShowComments={closeComments}
            commentLoading={commentLoading}
    showComments={showCommentsPostId}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
