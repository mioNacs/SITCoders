import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

const CommentsUIContext = createContext(null);

export const useCommentsUI = () => {
  const ctx = useContext(CommentsUIContext);
  if (!ctx) throw new Error('useCommentsUI must be used within CommentsUIProvider');
  return ctx;
};

export const CommentsUIProvider = ({ children }) => {
  const [showCommentsPostId, setShowCommentsPostId] = useState(null);

  const openComments = useCallback((postId) => setShowCommentsPostId(postId || null), []);
  const closeComments = useCallback(() => setShowCommentsPostId(null), []);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeComments();
    };
    if (showCommentsPostId) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showCommentsPostId, closeComments]);

  const value = useMemo(() => ({
    showCommentsPostId,
    openComments,
    closeComments,
  }), [showCommentsPostId, openComments, closeComments]);

  return (
    <CommentsUIContext.Provider value={value}>{children}</CommentsUIContext.Provider>
  );
};
