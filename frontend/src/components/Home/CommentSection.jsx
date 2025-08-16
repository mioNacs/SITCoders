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
import { createComment } from "../../services/commentApi";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import CommentCard from "./CommentCard";
import { renderSafeMarkdown } from '../../utils/sanitize';

const CommentSection = ({ postId, comments, setComments, commentLoading }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeText, setCodeText] = useState('');
  const [showToolsMenu, setShowToolsMenu] = useState(false);

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
    { value: 'javascript', label: 'JavaScript' },
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

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createComment(postId, newComment);

      // Update comments state
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), result.comment],
      }));

      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="sticky bottom-0 z-50 p-6 bg-white border-t border-gray-200">
        {/* Live Preview */}
        {newComment && user?.isAdminVerified && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg border">
            <div className="text-xs text-gray-500 mb-1">Preview:</div>
            <div 
              className="markdown-body text-sm text-gray-700 break-words"
              dangerouslySetInnerHTML={{ 
                __html: renderSafeMarkdown(newComment) 
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <div className="flex items-center gap-3 flex-1">
            {user?.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt="Your profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUser className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1" />
            )}
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                user?.isAdminVerified
                  ? "Write a comment... "
                  : "You must be verified by an admin to comment."
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none resize-none font-mono text-sm"
              disabled={submitting || !user?.isAdminVerified}
              rows={2}
            />
            {user?.isAdminVerified && (
              <div className="relative">
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
                  <div className="absolute right-0 bottom-full mb-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-10">
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
            )}
          <button
            type="submit"
            disabled={
                submitting || !newComment.trim() || !user?.isAdminVerified
            }
            className="bg-gradient-to-r text-orange-400 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
            {submitting ? (
                <FaSpinner className="animate-spin" size={32} />
            ) : (
                <FaPaperPlane size={32} />
            )}
          </button>
        </div>
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
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertCode}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
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
    </>
  );
};

export default CommentSection;
