import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
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
  // Edit/Delete are handled globally by PostUIProvider modals

  // Check admin status
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

            {/* Tag Filter */}
            { !isSuspended && (<div className="flex flex-wrap px-3 py-3 md:py-0 border-y md:border-none border-gray-300  bg-white md:bg-white/0 items-center gap-2">
              <button
                className={`px-3 py-1 rounded-full text-md border transition ${!tag ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                onClick={() => changeTag('')}
              >
                All
              </button>
              {allowedTags.map(t => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-full text-md capitalize border transition ${tag === t ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => changeTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
