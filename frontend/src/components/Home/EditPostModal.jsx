import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSpinner, FaBold, FaItalic, FaSmile, FaCode } from 'react-icons/fa';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import { renderSafeMarkdown } from '../../utils/sanitize';

function EditPostModal({ isOpen, onClose, onSubmit, post, isAdmin }) {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeText, setCodeText] = useState('');
  
  const textareaRef = useRef(null);

  // Initialize form with post data when modal opens
  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content || '');
      setTag(post.tag || 'general');
    }
  }, [isOpen, post]);

  // Text formatting functions
  const insertTextAtCursor = (startTag, endTag = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    const newContent = beforeText + startTag + textToInsert + endTag + afterText;
    
    setContent(newContent);
    
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
    
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    const newContent = beforeText + emojiObject.emoji + afterText;
    setContent(newContent);
    
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      const newCursorPos = start + emojiObject.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Convert markdown-like syntax to HTML for preview with auto URL detection
  const formatContentForDisplay = (content) => {
    if (!content) return '';
    
    return content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Auto-detect URLs (http, https, www)
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-all">$1</a>')
      .replace(/(www\.[^\s]+)/g, '<a href="http://$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-all">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.warning("Please add some content to your post");
      return;
    }

    if (["announcement", "event"].includes(tag) && !isAdmin) {
      toast.error("Only administrators can create announcements and events");
      return;
    }

    setIsSubmitting(true);
    
    const postData = {
      content: content.trim(),
      tag
    };

    const result = await onSubmit(post._id, postData);
    if (result.success) {
      onClose();
      setContent('');
      setTag('general');
      setShowEmojiPicker(false);
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setContent('');
      setTag('general');
      setShowEmojiPicker(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Edit Post
              </h3>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border">
              <button
                type="button"
                onClick={handleBold}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Bold"
              >
                <FaBold className="text-gray-600" size={14} />
              </button>
              <button
                type="button"
                onClick={handleItalic}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Italic"
              >
                <FaItalic className="text-gray-600" size={14} />
              </button>
              <button
                type="button"
                onClick={() => setShowCodeBox(s => !s)}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Add code"
              >
                <FaCode className="text-gray-600" size={14} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
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

            {/* Content Textarea */}
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                ref={textareaRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Edit your post... Use **bold**, *italic*, paste URLs directly, and emojis 😊"
                required
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 resize-none outline-none font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                rows={8}
              />
            </div>

            {/* Live Preview */}
            {content && (
              <div className="mb-4 p-3 rounded-lg border">
                <div className="text-xs text-gray-500 mb-2">Preview:</div>
                <div 
                  className="markdown-body text-sm text-gray-700 break-words"
                  dangerouslySetInnerHTML={{ 
                    __html: renderSafeMarkdown(content) 
                  }}
                />
              </div>
            )}

            {/* Tag Selection */}
            <div className="mb-6">
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                Tag
              </label>
              <select
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-500 focus:border-orange-400 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="general">General</option>
                <option value="query">Query</option>
                <option value="project">Project</option>
                {isAdmin && (
                  <>
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                  </>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Post</span>
                )}
              </button>
            </div>
          </form>

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
                    showPreview: false
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditPostModal;
