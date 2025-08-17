import React from 'react';
import { FaSpinner, FaClipboard, FaBan } from 'react-icons/fa';
import PostCard from './PostCard';
import { useAuth } from '../../context/AuthContext';

const PostsFeed = ({ 
  posts, 
  postsLoading, 
  comments,
  onShowComments,
  formatDate,
  getTagStyle 
}) => {
  const { isSuspended, suspensionEnd } = useAuth();
  return (
    <div className=" border-gray-400">
      {isSuspended ? (
                <>
                <div className="flex font-Saira flex-col items-center justify-center h-64 text-orange-700">
                  <FaBan size={48} className="mb-4" />
                  <p className="text-lg font-bold text-center">This account is suspended <br />
                    {suspensionEnd && (
                      <span className='text-md font-medium'>
                        <span> </span>until {new Date(suspensionEnd).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-center">
                    You can't use this website while your account is suspended.
                  </p>
                </div>
                </>
              ) : postsLoading ? (
        <div className="flex justify-center items-center py-6">
          <FaSpinner className="animate-spin text-orange-500" size={24} />
          <span className="ml-2 text-gray-600">Loading posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <FaClipboard className="mx-auto mb-4 text-gray-400" size={48} />
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              comments={comments}
              onShowComments={onShowComments}
              formatDate={formatDate}
              getTagStyle={getTagStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsFeed;