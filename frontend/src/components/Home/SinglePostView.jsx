import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSpinner, FaArrowLeft, FaUser, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPostById } from '../../services/postApi';
import { getComments } from '../../services/commentApi';
import { useAuth } from '../../context/AuthContext';
import CommentSection from './CommentSection';
import SharePostButton from './SharePostButton';
import { renderSafeMarkdown } from '../../utils/sanitize';

const PostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  // Format date function
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  // Get tag style
  const getTagStyle = (tag) => {
    const tagColors = {
      "general": "bg-blue-100 text-blue-800",
      "query": "bg-green-100 text-green-800",
      "announcement": "bg-yellow-100 text-yellow-800",
      "event": "bg-purple-100 text-purple-800",
      "project": "bg-red-100 text-red-800",
    };
    return tagColors[tag] || "bg-gray-100 text-gray-800";
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        navigate('/home');
        return;
      }

      try {
        setLoading(true);
        const postData = await getPostById(postId);
        setPost(postData.post);

        // Fetch comments for this post
        const commentsData = await getComments(postId);
        setComments({ [postId]: commentsData.parentComment || [] });
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      fetchPost();
    }
  }, [postId, navigate, isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-orange-500" size={32} />
          <span className="mt-4 text-gray-600">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h2>
          <Link 
            to="/home" 
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto py-4">

        {/* Post Card */}
        <div className="bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {post.author?.profilePicture?.url ? (
                  <img
                    src={post.author.profilePicture.url}
                    alt={post.author.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author?.fullName?.charAt(0) || <FaUser />}
                  </div>
                )}
                <div>
                  <Link
                    to={`/profile/${post.author?.username}`}
                    className="font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                  >
                    {post.author?.fullName || 'Unknown User'}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                    {post.beenEdited && (
                      <span className="ml-2 text-orange-500">(edited)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.tag && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTagStyle(post.tag)}`}>
                    {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
                  </span>
                )}
                <SharePostButton post={post} />
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-gray max-w-none">
              <div
                className="markdown-body text-gray-800 break-words"
                dangerouslySetInnerHTML={{
                  __html: renderSafeMarkdown(post.content),
                }}
              />
            </div>

            {/* Post Image */}
            {post.postImage?.url && (
              <div className="mt-4">
                <img
                  src={post.postImage.url}
                  alt="Post"
                  className="w-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <FaComments size={16} />
                <span className="text-sm">
                  {comments[post._id]?.length || 0} Comments
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-50">
            <CommentSection
              postId={post._id}
              comments={comments}
              setComments={setComments}
              commentLoading={commentLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;
