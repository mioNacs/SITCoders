import React, { useState, useEffect } from 'react'
import { createComment, createReply } from '../../services/commentApi'
import { FaTimes, FaUser, FaSpinner, FaPaperPlane, FaReply } from 'react-icons/fa'

function ViewPost({
    posts,
    comments,
    setShowComments,
    setComments,
    setCommentLoading,
    commentLoading,
    showComments
}) {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showReplies, setShowReplies] = useState({})

  // Find the current post
  const currentPost = posts.find(post => post._id === showComments)
  const postComments = comments[showComments] || []

  // Format date function
  const formatDate = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'now'
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await createComment(showComments, newComment.trim())
      
      // Update comments state
      setComments(prev => ({
        ...prev,
        [showComments]: [...(prev[showComments] || []), response.comment]
      }))
      
      setNewComment('')
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle reply submission
  const handleSubmitReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim() || !replyTo) return

    setSubmitting(true)
    try {
      const response = await createReply(replyTo, replyContent.trim())
      
      // Update comments state - add reply to the parent comment
      setComments(prev => {
        const updatedComments = [...(prev[showComments] || [])]
        const parentIndex = updatedComments.findIndex(comment => comment._id === replyTo)
        if (parentIndex !== -1) {
          updatedComments[parentIndex] = {
            ...updatedComments[parentIndex],
            replies: [...(updatedComments[parentIndex].replies || []), response.comment]
          }
        }
        return {
          ...prev,
          [showComments]: updatedComments
        }
      })
      
      setReplyContent('')
      setReplyTo(null)
    } catch (error) {
      console.error('Error creating reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentPost) return null

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowComments(false)
        }
      }}
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className='bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Post & Comments</h2>
          <button
            onClick={() => setShowComments(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Post Content */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              {currentPost.author?.profilePicture ? (
                <img
                  src={currentPost.author.profilePicture.url}
                  alt="Author"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-10 h-10 text-gray-400 border rounded-full p-2" />
              )}
              <div>
                <h4 className="font-semibold text-gray-800">
                  {currentPost.author?.fullName || currentPost.author?.username || "Unknown User"}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDate(currentPost.createdAt)}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{currentPost.content}</p>
            
            {currentPost.postImage?.url && (
              <img
                src={currentPost.postImage.url}
                alt="Post"
                className="w-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Comments ({postComments.length})
            </h3>

            {commentLoading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-orange-500" size={24} />
                <span className="ml-2 text-gray-600">Loading comments...</span>
              </div>
            ) : postComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {postComments.map((comment) => (
                  <div key={comment._id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {comment.user?.profilePicture ? (
                        <img
                          src={comment.user.profilePicture.url}
                          alt="User"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-8 h-8 text-gray-400 border rounded-full p-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {comment.user?.fullName || comment.user?.username || "Anonymous"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        
                        <div className='flex items-center'>
                            <button
                          onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                          className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
                        >
                          <FaReply size={12} />
                          Reply
                        </button>

                        {/* Show Replies Toggle */}
                        {comment.replies && comment.replies.length > 0 && (
                          <button
                            onClick={() => setShowReplies(prev => ({
                              ...prev,
                              [comment._id]: !prev[comment._id]
                            }))}
                            className="text-sm text-gray-600 hover:text-gray-800 ml-4 cursor-pointer"
                          >
                            {showReplies[comment._id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                          </button>
                        )}
                        </div>

                        {/* Reply Form */}
                        {replyTo === comment._id && (
                          <form onSubmit={handleSubmitReply} className="mt-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none"
                                disabled={submitting}
                              />
                              <button
                                type="submit"
                                disabled={submitting || !replyContent.trim()}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && showReplies[comment._id] && (
                          <div className="mt-3 ml-4 space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-800 text-sm">
                                    {reply.user?.fullName || reply.user?.username || "Anonymous"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment Form */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-orange-400 focus:border-orange-500 outline-none"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Comment</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ViewPost
