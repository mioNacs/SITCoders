import React, { useState, useRef } from 'react';
import { FaUser, FaReply, FaSpinner, FaPaperPlane, FaBold, FaItalic, FaSmile, FaTimes } from 'react-icons/fa';
import { createReply } from '../../services/commentApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import { renderSafeMarkdown } from '../../utils/sanitize';

const CommentCard = ({ comment, postId, setComments }) => {
  const { user } = useAuth();
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingToReply, setReplyingToReply] = useState(null);
  
  const textareaRef = useRef(null);

  // Text formatting functions for replies
  const insertTextAtCursor = (startTag, endTag = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = replyContent.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const beforeText = replyContent.substring(0, start);
    const afterText = replyContent.substring(end);
    
    const newContent = beforeText + startTag + textToInsert + endTag + afterText;
    
    setReplyContent(newContent);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPos = start + startTag.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleBold = () => {
    insertTextAtCursor('**', '**', 'bold text');
  };

  const handleItalic = () => {
    insertTextAtCursor('*', '*', 'italic text');
  };

  const handleEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const beforeText = replyContent.substring(0, start);
    const afterText = replyContent.substring(end);
    
    const newContent = beforeText + emojiObject.emoji + afterText;
    setReplyContent(newContent);
    
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      const newCursorPos = start + emojiObject.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Format date function
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
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  };

  // Handle reply submission (works for both comment replies and reply-to-reply)
  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.warning("Please enter a reply");
      return;
    }

    setSubmitting(true);
    try {
      // If replying to a reply, use the parent comment ID
      const targetId = replyingToReply || replyTo;
      const result = await createReply(targetId, replyContent);
      
      // Update comments state with new reply
      setComments((prev) => {
        const updatedComments = [...(prev[postId] || [])];
        const commentIndex = updatedComments.findIndex(
          (c) => c._id === comment._id
        );
        if (commentIndex !== -1) {
          updatedComments[commentIndex] = {
            ...updatedComments[commentIndex],
            replies: [
              ...(updatedComments[commentIndex].replies || []),
              result.comment,
            ],
          };
        }
        return {
          ...prev,
          [postId]: updatedComments,
        };
      });

      setReplyContent("");
      setReplyTo(null);
      setReplyingToReply(null);
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to add reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyClick = (targetId, isReplyToReply = false) => {
    if (replyTo === targetId) {
      // Close reply form
      setReplyTo(null);
      setReplyingToReply(null);
      setReplyContent("");
    } else {
      // Open reply form
      setReplyTo(targetId);
      setReplyingToReply(isReplyToReply ? comment._id : null);
      setReplyContent("");
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4">
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
          <div>
            <h5 className="font-medium text-gray-800">
              {comment.user?.fullName ||
                comment.user?.username ||
                "Unknown User"}
            </h5>
            <p className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Comment Content with Rich Text Support */}
        <div 
          className="text-gray-700 mb-2 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ 
            __html: renderSafeMarkdown(comment.content) 
          }}
        />

        {/* Reply button */}
        {user?.isAdminVerified && (
          <button
            onClick={() => handleReplyClick(comment._id)}
            className="text-orange-500 text-sm hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <FaReply size={12} />
            <span>Reply</span>
          </button>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => toggleReplies(comment._id)}
              className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
            >
              {showReplies[comment._id] ? "Hide" : "Show"}{" "}
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>

            {showReplies[comment._id] && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                {comment.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-gray-50 rounded p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
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
                      </h6>
                      <p className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </p>
                    </div>
                    
                    {/* Reply Content with Rich Text Support */}
                    <div 
                      className="text-gray-700 text-sm mb-2 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: renderSafeMarkdown(reply.content) 
                      }}
                    />

                    {/* Reply to Reply button */}
                    {user?.isAdminVerified && (
                      <button
                        onClick={() => handleReplyClick(reply._id, true)}
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

        {/* Reply form */}
        {replyTo === comment._id && (
          <div className="mt-3 ml-6">

            {/* Live Preview for Reply */}
            {replyContent && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-500 mb-1">Preview:</div>
                <div 
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: renderSafeMarkdown(replyContent) 
                  }}
                />
              </div>
            )}

            <form onSubmit={handleSubmitReply}>
              <div className="flex gap-2">
                <textarea
                  ref={textareaRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={replyingToReply ? "Reply to this reply..." : "Write a reply..."}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none text-sm resize-none font-mono"
                  disabled={submitting}
                  rows={2}
                />
                {/* Rich Text Toolbar for Reply */}
            <div className="flex items-center p-2">
              <button
                type="button"
                onClick={handleBold}
                disabled={submitting}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Bold"
              >
                <FaBold className="text-gray-600" size={15} />
              </button>
              <button
                type="button"
                onClick={handleItalic}
                disabled={submitting}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Italic"
              >
                <FaItalic className="text-gray-600" size={15} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={submitting}
                  className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                  title="Insert Emoji"
                >
                  <FaSmile className="text-gray-600" size={15} />
                </button>
              </div>
            </div>
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin" size={12} />
                  ) : (
                    <FaPaperPlane size={12} />
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reply form for reply-to-reply */}
        {comment.replies && comment.replies.some(reply => replyTo === reply._id) && (
          <div className="mt-3 ml-12">

            {/* Live Preview for Reply-to-Reply */}
            {replyContent && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-500 mb-1">Preview:</div>
                <div 
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: renderSafeMarkdown(replyContent) 
                  }}
                />
              </div>
            )}

            <form onSubmit={handleSubmitReply}>
              <div className="flex gap-2">
                <div className='flex items-center w-full'>
                <textarea
                  ref={textareaRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Reply to this reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none text-sm resize-none font-mono"
                  disabled={submitting}
                  rows={2}
                />
                <div className="flex items-center mb-2 p-2">
              <button
                type="button"
                onClick={handleBold}
                disabled={submitting}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 cursor-pointer"
                title="Bold"
              >
                <FaBold className="text-gray-600" size={15} />
              </button>
              <button
                type="button"
                onClick={handleItalic}
                disabled={submitting}
                className="p-1 cursor-pointer hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Italic"
              >
                <FaItalic className="text-gray-600" size={15} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={submitting}
                  className="p-1 cursor-pointer hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                  title="Insert Emoji"
                >
                  <FaSmile className="text-gray-600" size={15} />
                </button>
              </div>
            </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin" size={12} />
                  ) : (
                    <FaPaperPlane size={12} />
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Emoji Picker Modal for Replies */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="relative bg-white rounded-lg shadow-xl">
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
            >
              <FaTimes size={12} />
            </button>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={Math.min(350, window.innerWidth - 32)}
              height={Math.min(450, window.innerHeight - 100)}
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: false
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCard;