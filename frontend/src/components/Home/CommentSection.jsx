import React, { useState, useRef } from "react";
import {
  FaSpinner,
  FaUser,
  FaPaperPlane,
  FaBold,
  FaItalic,
  FaSmile,
  FaTimes,
  FaCode,
  FaEllipsisH,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { createComment, createReply, updateComment } from "../../services/commentApi";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import CommentCard from "./CommentCard";
import { renderSafeMarkdown } from '../../utils/sanitize';

const CommentSection = ({ postId, comments, setComments, commentLoading }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  // Central reply target: when set, submitting will create a reply to this parent comment
  const [replyTarget, setReplyTarget] = useState(null); // { parentCommentId, userFullName }
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeText, setCodeText] = useState('');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // { commentId }

  const textareaRef = useRef(null);
  const postComments = comments[postId] || [];

  // Text formatting functions
  const insertTextAtCursor = (startTag, endTag = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newComment.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const beforeText = newComment.substring(0, start);
    const afterText = newComment.substring(end);

    const newContent =
      beforeText + startTag + textToInsert + endTag + afterText;

    setNewComment(newContent);

    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPos = start + startTag.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleBold = () => {
    insertTextAtCursor("**", "**", "bold text");
  };

  const handleItalic = () => {
    insertTextAtCursor("*", "*", "italic text");
  };

  const LANG_OPTIONS = [
    { value: 'jsx', label: 'JSX' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'tsx', label: 'TSX' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'css', label: 'CSS' },
    { value: 'markup', label: 'HTML' },
    { value: 'text', label: 'Plain text' },
  ];

  const handleInsertCode = () => {
    const code = (codeText || '').replace(/\r\n/g, '\n');
    if (!code.trim()) return;
    const lang = codeLanguage || 'text';
    const snippet = `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    insertTextAtCursor(snippet, '', '');
    setCodeText('');
    setShowCodeBox(false);
  };

  const handleEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const beforeText = newComment.substring(0, start);
    const afterText = newComment.substring(end);

    const newContent = beforeText + emojiObject.emoji + afterText;
    setNewComment(newContent);

    setShowEmojiPicker(false);

    setTimeout(() => {
      const newCursorPos = start + emojiObject.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleStartEdit = ({ commentId, content }) => {
    setReplyTarget(null);
    setEditTarget({ commentId });
    setNewComment(content || '');
    // focus textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  // Handle comment / reply submission via single box
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      if (editTarget?.commentId) {
        // Update an existing comment or reply
        const result = await updateComment(editTarget.commentId, newComment);
        const updatedComment = result.comment;
        
        setComments((prev) => {
          const current = [...(prev[postId] || [])];
          // Try top-level first
          const idx = current.findIndex((c) => c._id === editTarget.commentId);
          if (idx !== -1) {
            current[idx] = { ...current[idx], ...updatedComment };
            return { ...prev, [postId]: current };
          }
          // Else, update inside replies
          for (let i = 0; i < current.length; i++) {
            const replies = current[i].replies || [];
            const rIdx = replies.findIndex((r) => r._id === editTarget.commentId);
            if (rIdx !== -1) {
              const newReplies = [...replies];
              newReplies[rIdx] = { ...newReplies[rIdx], ...updatedComment };
              current[i] = { ...current[i], replies: newReplies };
              break;
            }
          }
          return { ...prev, [postId]: current };
        });
        setEditTarget(null);
        setNewComment("");
        toast.success("Comment updated successfully!");
        return;
      }

      if (replyTarget?.parentCommentId) {
        // Create a reply to an existing comment
        const result = await createReply(replyTarget.parentCommentId, newComment);

        // Update comments state: push reply into the parent comment's replies
        setComments((prev) => {
          const current = [...(prev[postId] || [])];
          const idx = current.findIndex(c => c._id === replyTarget.parentCommentId);
          if (idx !== -1) {
            const parent = current[idx];
            const updatedParent = {
              ...parent,
              replies: [...(parent.replies || []), result.comment],
            };
            current[idx] = updatedParent;
          }
          return { ...prev, [postId]: current };
        });

        setReplyTarget(null);
        setNewComment("");
        toast.success("Reply added successfully!");
      } else {
        // Create a new top-level comment
        const result = await createComment(postId, newComment);

        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), result.comment],
        }));

        setNewComment("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Set central reply target from child cards
  const handleSetReplyTarget = ({ parentCommentId, userFullName }) => {
    setReplyTarget({ parentCommentId, userFullName });
    // Insert @mention if not already present or caret at start
    const mention = `@${userFullName}`.trim();
    const textarea = textareaRef.current;
    if (!textarea) return;
    const value = newComment;
    // If mention not present at the start, prepend with a trailing space
    if (!value.startsWith(`${mention} `)) {
      const insertion = `${mention} `;
      const cursorStart = textarea.selectionStart ?? 0;
      const cursorEnd = textarea.selectionEnd ?? 0;
      // If textarea empty or caret at start, just prepend
      const newVal = value.length === 0
        ? insertion
        : `${insertion}${value}`;
      setNewComment(newVal);
      // Move caret to end of mention
      setTimeout(() => {
        const pos = insertion.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }, 0);
    } else {
      // Focus textarea without changing content
      setTimeout(() => textarea.focus(), 0);
    }
  };

  return (
    <div className="comment-container">
      {/* Comments List */}
      <div className="flex-1 py-6 md:px-6">
        {commentLoading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-orange-500" size={24} />
            <span className="ml-2 text-gray-600">Loading comments...</span>
          </div>
        ) : postComments.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {postComments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                postId={postId}
                setComments={setComments}
                onStartEdit={(commentId, content) => handleStartEdit({ commentId, content })}
                onStartReply={(parentCommentId, userFullName) =>
                  handleSetReplyTarget({ parentCommentId, userFullName })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="sticky bottom-0 rounded-b-lg z-50 p-2 bg-white border-t border-gray-200">
        {/* Live Preview */}
        {newComment && user?.isAdminVerified && (
          <div className="mb-2 p-2 rounded-lg border">
            <div className="text-xs text-gray-500 mb-1">Preview:</div>
            <div 
              className="markdown-body text-sm text-gray-700 break-words"
              dangerouslySetInnerHTML={{ 
                __html: renderSafeMarkdown(newComment) 
              }}
            />
          </div>
        )}

        {/* Edit target pill */}
        {editTarget?.commentId && (
          <div className="mb-2 inline-flex items-center gap-2 text-sm text-gray-700 bg-yellow-100 border border-yellow-200 rounded-full px-3 py-1">
            Editing your comment
            <button
              type="button"
              onClick={() => { setEditTarget(null); setNewComment(''); }}
              className="ml-1 px-2 py-0.5 rounded-full bg-yellow-200 hover:bg-yellow-300"
              aria-label="Cancel edit"
            >
              ×
            </button>
          </div>
        )}

        {/* Reply target pill */}
        {replyTarget?.userFullName && (
          <div className="mb-2 inline-flex items-center gap-2 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
            Replying to <span className="font-medium">@{replyTarget.userFullName}</span>
            <button
              type="button"
              onClick={() => {
                // Remove only the @mention from newComment, preserve other text
                const mention = replyTarget?.userFullName ? `@${replyTarget.userFullName} ` : '';
                if (newComment.startsWith(mention)) {
                  setNewComment(newComment.slice(mention.length));
                }
                setReplyTarget(null);
              }}
              className="ml-1 px-2 py-0.5 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Cancel reply"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              placeholder={
                user?.isAdminVerified
                  ? (replyTarget?.userFullName
                      ? `Reply to @${replyTarget.userFullName}...`
                      : "Write a comment...")
                  : "Only verified users can comment"
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none resize-y"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowToolsMenu(v => !v)}
                disabled={submitting}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                aria-haspopup="menu"
                aria-expanded={showToolsMenu}
                title="Formatting options"
              >
                <FaEllipsisH className="text-gray-600" size={18} />
              </button>
              {showToolsMenu && (
                <div className="absolute right-0 bottom-8 w-44 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                  <button
                    type="button"
                    onClick={() => { handleBold(); setShowToolsMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaBold /> <span>Bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleItalic(); setShowToolsMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaItalic /> <span>Italic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCodeBox(s => !s); setShowToolsMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaCode /> <span>Add code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowToolsMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaSmile /> <span>Emoji</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !newComment.trim() || !user?.isAdminVerified}
            className="bg-orange-400 text-white py-3 px-5 cursor-pointer rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <FaSpinner className="animate-spin" size={16} />
            ) : (
              <FaPaperPlane size={16} />
            )}
          </button>
        </form>
        {showCodeBox && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Language</label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-500 focus:border-orange-400 outline-none text-sm"
              >
                {LANG_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              rows={6}
              placeholder="Paste or type your code here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 resize-y outline-none font-mono text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setCodeText(''); setShowCodeBox(false); }}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertCode}
                className="px-3 py-2 bg-orange-400 cursor-pointer text-white rounded-md hover:bg-orange-600"
              >
                Insert code
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emoji Picker Modal */}
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
                showPreview: false,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
