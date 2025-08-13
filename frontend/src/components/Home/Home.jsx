import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { verifyIsAdmin } from "../../services/adminApi";
import { useHomePosts } from "./hooks/useHomePosts";
import CreatePostButton from "./CreatePostButton";
import CreatePostModal from "./CreatePostModal";
import EditPostModal from "./EditPostModal";
import PostsFeed from "./PostsFeed";
import Sidebar from "./Sidebar";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ViewPost from "./ViewPost";
import Pagination from "../UI/Pagination";

function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
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
  } = useHomePosts();

  // Admin status state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // Modal states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPostMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const canDeletePost = (post) => {
    if (!user) return false;
    const isAuthor = post.author?._id === user._id;
    const isAdminUser = isAdmin;
    return isAuthor || isAdminUser;
  };

  const canEditPost = (post) => {
    if (!user) return false;
    const isAuthor = post.author?._id === user._id
    return isAuthor
  }

  const handleDeleteConfirm = async (postId) => {
    setDeleteLoading(postId);
    const result = await handleDeletePost(postId);
    if (result.success) {
      setShowDeleteConfirm(null);
      setShowPostMenu(null);
    }
    setDeleteLoading(null);
  };

  const handleEditConfirm = async (postId, postData) => {
    const result = await handleEditPost(postId, postData);
    if (result.success) {
      setShowEditPost(null);
      setShowPostMenu(null);
    }
    return result;
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
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
    <>
      <div className="pt-20 min-h-screen bg-orange-50">
        <div className="flex flex-col md:flex-row gap-6 md:max-w-[90%] lg:max-w-[80%] mx-0 md:mx-auto md:pb-8">
          {/* Main Content Area */}
          <div className="md:w-2/3 h-full flex flex-col gap-4">
            <CreatePostButton 
              user={user} 
              onCreatePost={() => setShowCreatePost(true)} 
            />

            {/* Tag Filter */}
            <div className="flex flex-wrap px-3 py-3 md:py-0 border-y md:border-none border-gray-300  bg-white md:bg-white/0 items-center gap-2">
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
            <PostsFeed
              posts={posts}
              postsLoading={postsLoading}
              comments={comments}
              showPostMenu={showPostMenu}
              setShowPostMenu={setShowPostMenu}
              onDeleteConfirm={setShowDeleteConfirm}
              onEditPost={setShowEditPost}
              onShowComments={handleShowComments}
              canDeletePost={canDeletePost}
              canEditPost={canEditPost}
              formatDate={formatDate}
              getTagStyle={getTagStyle}
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

      <EditPostModal
        isOpen={!!showEditPost}
        onClose={() => setShowEditPost(null)}
        onSubmit={handleEditConfirm}
        post={showEditPost}
        isAdmin={isAdmin}
      />

      <DeleteConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        postId={showDeleteConfirm}
      />

      {showComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <ViewPost 
            posts={posts}
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
}

export default Home;
