import React, { useState, useRef } from "react";
import {
  FaTimes,
  FaImage,
  FaSpinner,
  FaBold,
  FaItalic,
  FaSmile,
  FaCode,
} from "react-icons/fa";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { renderSafeMarkdown } from '../../utils/sanitize';
import { useNavigate } from "react-router-dom";

const CreatePostModal = ({ isOpen, onClose, onSubmit, isAdmin }) => {
  const [newPost, setNewPost] = useState({
    content: "",
    tag: "general",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeText, setCodeText] = useState("");

  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const getAvailableTags = () => {
    const baseTags = [
      { value: "general", label: "General" },
      { value: "query", label: "Query" },
      { value: "project", label: "Project" },
    ];

    const adminTags = [
      { value: "announcement", label: "Announcement" },
      { value: "event", label: "Event" },
    ];

    return isAdmin ? [...baseTags, ...adminTags] : baseTags;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setNewPost({ ...newPost, image: file });

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPost({ ...newPost, image: null });
    setImagePreview(null);
  };

  // Text formatting functions
  const insertTextAtCursor = (startTag, endTag = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const beforeText = newPost.content.substring(0, start);
    const afterText = newPost.content.substring(end);

    const newContent =
      beforeText + startTag + textToInsert + endTag + afterText;

    setNewPost({ ...newPost, content: newContent });

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
    const code = (codeText || "").replace(/\r\n/g, "\n");
    if (!code.trim()) return;
    const lang = codeLanguage || 'text';
    const snippet = `\n\n\
\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    insertTextAtCursor(snippet, "", "");
    setCodeText("");
    setShowCodeBox(false);
  };

  const handleEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const beforeText = newPost.content.substring(0, start);
    const afterText = newPost.content.substring(end);

    const newContent = beforeText + emojiObject.emoji + afterText;
    setNewPost({ ...newPost, content: newContent });

    setShowEmojiPicker(false);

    setTimeout(() => {
      const newCursorPos = start + emojiObject.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.content.trim()) {
      toast.warning("Please add some content to your post");
      return;
    }

    if (["announcement", "event"].includes(newPost.tag) && !isAdmin) {
      toast.error("Only administrators can create announcements and events");
      return;
    }

    setCreateLoading(true);

    const formData = new FormData();
    formData.append("content", newPost.content);
    formData.append("tag", newPost.tag);

    if (newPost.image) {
      formData.append("postImage", newPost.image);
    }

    const result = await onSubmit(formData);

    if (result.success) {
      setNewPost({ content: "", tag: "general", image: null });
      setImagePreview(null);
      setShowEmojiPicker(false);
      onClose();
    }

    setCreateLoading(false);
    navigate('/')
  };

  const handleClose = () => {
    setNewPost({ content: "", tag: "general", image: null });
    setImagePreview(null);
    setShowEmojiPicker(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Create New Post
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="px-6 pt-6">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border">
              <button
                type="button"
                onClick={handleBold}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bold"
              >
                <FaBold className="text-gray-600" size={14} />
              </button>
              <button
                type="button"
                onClick={handleItalic}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Italic"
              >
                <FaItalic className="text-gray-600" size={14} />
              </button>
              <button
                type="button"
                onClick={() => setShowCodeBox((s) => !s)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Add code"
              >
                <FaCode className="text-gray-600" size={14} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="Insert Emoji"
                >
                  <FaSmile className="text-gray-600" size={14} />
                </button>
              </div>
              <div className="ml-auto text-xs text-gray-500">
                Use **bold**, *italic*, URLs auto-detected
              </div>
            </div>

            {showCodeBox && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border space-y-3">
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
                    onClick={() => { setCodeText(""); setShowCodeBox(false); }}
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

            {/* Content Textarea */}
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 resize-none outline-none font-mono text-sm"
                rows="8"
                placeholder="Share your thoughts..."
                required
              />
            </div>

            {/* Live Preview */}
            {newPost.content && (
        <div className="mb-4 p-3 rounded-lg border">
                <div className="text-xs text-gray-500 mb-2">Preview:</div>
                <div 
          className="markdown-body text-sm text-gray-700 break-words"
                  dangerouslySetInnerHTML={{ 
                    __html: renderSafeMarkdown(newPost.content) 
                  }}
                />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div className="sticky bottom-0 py-4 bg-white border-t">
            <div className="flex items-center justify-between">
              {/* Image Upload */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                    <FaImage className="text-gray-600" />
                    <span className="text-sm text-gray-600">Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Tag Selection */}
              <div className="mb-4">
                <select
                  value={newPost.tag}
                  onChange={(e) =>
                    setNewPost({ ...newPost, tag: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-500 focus:border-orange-400 outline-none"
                >
                  {getAvailableTags().map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading || !newPost.content.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>Post</span>
                )}
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>

      {/* Emoji Picker Overlay */}
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

export default CreatePostModal;
