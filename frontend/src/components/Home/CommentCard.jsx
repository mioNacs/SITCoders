import React, { useEffect, useRef, useState } from "react";
import { FaUser, FaReply, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { renderSafeMarkdown } from "../../utils/sanitize";
import { formatRelativeDate as formatDate } from "../../utils/formatters";
import {
  updateComment,
  deleteComment,
  adminDeleteComment,
} from "../../services/commentApi";
import { toast } from "react-toastify";
import DeleteConfirmModal from "./DeleteConfirmModal";

const CommentCard = ({
  comment,
  postId,
  setComments,
  onStartReply,
  onStartEdit,
}) => {
  const { user, isAdmin } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [openReplyMenuId, setOpenReplyMenuId] = useState(null);
  // central delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, isReply: false, replyUserId: null });

  // date formatter from utils

  const canEdit = user && comment.user?._id === user._id;
  const canDelete = canEdit || !!isAdmin;

  const openDeleteConfirm = (targetId, isReply = false, replyUserId = null) => {
    setDeleteTarget({ id: targetId, isReply, replyUserId });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (targetId) => {
    const { isReply, replyUserId } = deleteTarget;
    try {
      // Determine authorship for replies and comments
      const isAuthor = isReply
        ? Boolean(user && replyUserId && user._id === replyUserId)
        : Boolean(canEdit);

      // Always prefer admin endpoint when user is admin (solves admin author case)
      if (isAdmin) {
        await adminDeleteComment(targetId);
      } else if (isAuthor) {
        await deleteComment(targetId);
      } else {
        throw new Error("You do not have permission to delete this comment");
      }

      // Update local state
      setComments((prev) => {
        const current = [...(prev[postId] || [])];
        if (!isReply) {
          return {
            ...prev,
            [postId]: current.filter((c) => c._id !== targetId),
          };
        }
        // reply: find parent and remove from replies
        const parentIdx = current.findIndex((c) => c._id === comment._id);
        if (parentIdx !== -1) {
          const parent = current[parentIdx];
          const updated = {
            ...parent,
            replies: (parent.replies || []).filter((r) => r._id !== targetId),
          };
          current[parentIdx] = updated;
        }
        return { ...prev, [postId]: current };
      });
      toast.success("Comment deleted");
    } catch (e) {
      console.error("Delete comment failed", e);
      toast.error(e.message || "Failed to delete comment");
    } finally {
      setMenuOpen(false);
      setOpenReplyMenuId(null);
      setDeleteLoadingId(null);
      setConfirmOpen(false);
    }
  };

  // close menu on outside click or ESC
  useEffect(() => {
    if (!menuOpen && !openReplyMenuId) return;
    const onClick = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setMenuOpen(false);
      setOpenReplyMenuId(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setOpenReplyMenuId(null);
      }
    };
    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, openReplyMenuId]);

  return (
    <div className="comment-card border border-gray-200 rounded-lg p-4">
      <DeleteConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async (id) => {
          setDeleteLoadingId(id);
          await handleConfirmDelete(id);
        }}
        deleteLoading={deleteLoadingId}
        targetId={deleteTarget.id}
        title={deleteTarget.isReply ? 'Delete Reply' : 'Delete Comment'}
        message={deleteTarget.isReply ? 'Are you sure you want to delete this reply? This action cannot be undone.' : 'Are you sure you want to delete this comment? This action cannot be undone.'}
        confirmLabel="Delete"
      />
      <div className="flex items-center gap-3 mb-2">
        {comment.user?.profilePicture?.url ? (
          <img
            src={comment.user.profilePicture.url}
            alt="Commenter"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUser className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1" />
        )}
        <div className="flex-1">
          <h5 className="font-medium text-gray-800">
            {comment.user?.fullName || comment.user?.username || "Unknown User"}
            {(comment.createdAt < comment.updatedAt) && (
              <span className="pl-2 text-xs text-gray-500">(Edited)</span>
            )}
          </h5>
          <p className="text-xs text-gray-500">
            {formatDate(comment.createdAt)}
          </p>
        </div>
        {(canEdit || canDelete) && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Comment options"
            >
              <FaEllipsisV className="text-gray-500" size={12} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px] animate-fade-in">
                {canEdit && (
                  <button
                    onClick={() => {
                      onStartEdit && onStartEdit(comment._id, comment.content);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-blue-600"
                  >
                    <FaEdit size={12} /> Edit
                  </button>
                )}
        {canDelete && (
                  <button
          onClick={() => openDeleteConfirm(comment._id, false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-red-600"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="markdown-body text-gray-700 mb-2 break-words"
        dangerouslySetInnerHTML={{
          __html: renderSafeMarkdown(comment.content),
        }}
      />

      {/* Reply using main input with @mention */}
      {user?.isAdminVerified && (
        <button
          onClick={() =>
            onStartReply &&
            onStartReply(
              comment._id,
              comment.user?.fullName || comment.user?.username || "Unknown User"
            )
          }
          className="text-orange-500 text-sm hover:text-orange-600 transition-colors flex items-center gap-1"
        >
          <FaReply size={12} />
          <span>Reply</span>
        </button>
      )}

      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
          >
            {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "reply" : "replies"}
          </button>

          {showReplies && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {reply.user?.profilePicture?.url ? (
                        <img
                          src={reply.user.profilePicture.url}
                          alt="Replier"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />
                      )}
                      <h6 className="font-medium text-gray-800 text-sm">
                        {reply.user?.fullName ||
                          reply.user?.username ||
                          "Unknown User"}
                        {(reply.createdAt < reply.updatedAt) && (
                          <span className="pl-2 text-xs text-gray-500">(Edited)</span>
                        )}
                      </h6>
                      <p className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </p>
                    </div>
                    {(isAdmin || (user && reply.user?._id === user._id)) && (
                      <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setOpenReplyMenuId((prev) =>
                              prev === reply._id ? null : reply._id
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100"
                          aria-label="Reply options"
                          title="Options"
                        >
                          <FaEllipsisV size={12} className="text-gray-500" />
                        </button>
                        {openReplyMenuId === reply._id && (
                          <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded shadow z-10 min-w-[140px] animate-fade-in">
                            {user && reply.user?._id === user._id && (
                              <button
                                onClick={() => {
                                  onStartEdit &&
                                    onStartEdit(reply._id, reply.content);
                                  setOpenReplyMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-blue-600 flex items-center gap-2"
                              >
                                <FaEdit size={12} /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => {
                                openDeleteConfirm(reply._id, true, reply.user?._id);
                                setOpenReplyMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                            >
                              <FaTrash size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="markdown-body text-gray-700 text-sm mb-2 break-words"
                    dangerouslySetInnerHTML={{
                      __html: renderSafeMarkdown(reply.content),
                    }}
                  />

                  {user?.isAdminVerified && (
                    <button
                      onClick={() =>
                        onStartReply &&
                        onStartReply(
                          comment._id,
                          reply.user?.fullName ||
                            reply.user?.username ||
                            "Unknown User"
                        )
                      }
                      className="text-orange-400 text-xs hover:text-orange-500 transition-colors flex items-center gap-1"
                    >
                      <FaReply size={10} />
                      <span>Reply</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
