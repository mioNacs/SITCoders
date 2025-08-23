/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import PostFormModal from '../components/Home/PostFormModal';
import DeleteConfirmModal from '../components/Home/DeleteConfirmModal';
import SharePostModal from '../components/Home/SharePostModal';

const PostUIContext = createContext(null);

export const usePostUI = () => {
  const ctx = useContext(PostUIContext);
  if (!ctx) throw new Error('usePostUI must be used within PostUIProvider');
  return ctx;
};

export const PostUIProvider = ({ children, onEditPost, onDeleteConfirm }) => {
  const { user, isAdmin } = useAuth();

  // Which post's kebab menu is open
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  // Global action requests from menus
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [sharingPost, setSharingPost] = useState(null);

  // Handlers registered by pages (latest registration wins)
  const editHandlerRef = useRef(null);
  const deleteHandlerRef = useRef(null);

  const toggleMenu = useCallback((postId) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  }, []);

  const closeMenu = useCallback(() => setOpenMenuPostId(null), []);

  const canEditPost = useCallback(
    (post) => {
      if (!user) return false;
      return post?.author?._id === user._id;
    },
    [user]
  );

  const canDeletePost = useCallback(
    (post) => {
      if (!user) return false;
      const isAuthor = post?.author?._id === user._id;
      return isAuthor || !!isAdmin;
    },
    [user, isAdmin]
  );

  // Request actions triggered by menus; also call external handlers if provided
  const requestEdit = useCallback((post) => {
    setEditingPost(post || null);
    onEditPost && onEditPost(post);
  }, [onEditPost]);

  const requestDelete = useCallback((postId) => {
    setDeletingPostId(postId || null);
    onDeleteConfirm && onDeleteConfirm(postId);
  }, [onDeleteConfirm]);

  const requestShare = useCallback((post) => {
    setSharingPost(post || null);
  }, []);

  // Consumers can register confirm handlers for edit/delete
  const registerEditHandler = useCallback((fn) => {
    editHandlerRef.current = typeof fn === 'function' ? fn : null;
    return () => {
      // cleanup on unmount
      if (editHandlerRef.current === fn) editHandlerRef.current = null;
    };
  }, []);

  const registerDeleteHandler = useCallback((fn) => {
    deleteHandlerRef.current = typeof fn === 'function' ? fn : null;
    return () => {
      if (deleteHandlerRef.current === fn) deleteHandlerRef.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({
      openMenuPostId,
      toggleMenu,
      closeMenu,
      canEditPost,
      canDeletePost,
      // global requests
      editingPost,
      deletingPostId,
      requestEdit,
      requestDelete,
      requestShare,
      setEditingPost,
      setDeletingPostId,
      setSharingPost,
      registerEditHandler,
      registerDeleteHandler,
    }),
    [openMenuPostId, toggleMenu, closeMenu, canEditPost, canDeletePost, editingPost, deletingPostId, requestEdit, requestDelete, requestShare, registerEditHandler, registerDeleteHandler]
  );

  // Close any open menu on outside click
  useEffect(() => {
    const handleClick = () => setOpenMenuPostId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <PostUIContext.Provider value={value}>
      {children}

      {/* Centralized Post Form Modal for both Create and Edit */}
      <PostFormModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={async (formData, postId) => {
          if (!editHandlerRef.current) return { success: false, message: 'No edit handler registered' };
          // Pass both formData and postId to the handler
          const result = await editHandlerRef.current(postId, formData);
          if (result?.success) setEditingPost(null);
          return result;
        }}
        post={editingPost}
        isAdmin={!!isAdmin}
      />

      {/* Centralized Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingPostId}
        onClose={() => setDeletingPostId(null)}
        onConfirm={async (postId) => {
          if (!deleteHandlerRef.current) return;
          try {
            setDeleteLoading(postId);
            await deleteHandlerRef.current(postId);
            setDeletingPostId(null);
          } finally {
            setDeleteLoading(null);
          }
        }}
        deleteLoading={deleteLoading}
        postId={deletingPostId}
      />

      {/* Centralized Share Modal */}
      <SharePostModal
        isOpen={!!sharingPost}
        onClose={() => setSharingPost(null)}
        post={sharingPost}
      />
    </PostUIContext.Provider>
  );
};
