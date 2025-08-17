import React, { useState } from 'react';
import { FaUser, FaReply } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { renderSafeMarkdown } from '../../utils/sanitize';

const CommentCard = ({ comment, onStartReply }) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  return (
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
            {comment.user?.fullName || comment.user?.username || 'Unknown User'}
          </h5>
          <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
        </div>
      </div>

      <div
        className="markdown-body text-gray-700 mb-2 break-words"
        dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(comment.content) }}
      />

      {/* Reply using main input with @mention */}
      {user?.isAdminVerified && (
        <button
          onClick={() => onStartReply && onStartReply(
            comment._id,
            comment.user?.fullName || comment.user?.username || 'Unknown User'
          )}
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
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length}{' '}
            {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>

          {showReplies && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="rounded p-3">
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
                      {reply.user?.fullName || reply.user?.username || 'Unknown User'}
                    </h6>
                    <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                  </div>

                  <div
                    className="markdown-body text-gray-700 text-sm mb-2 break-words"
                    dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(reply.content) }}
                  />

                  {user?.isAdminVerified && (
                    <button
                      onClick={() => onStartReply && onStartReply(
                        comment._id,
                        reply.user?.fullName || reply.user?.username || 'Unknown User'
                      )}
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