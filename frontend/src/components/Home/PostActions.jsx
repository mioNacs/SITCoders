import React from 'react';
import { FaComments, FaArrowRight } from 'react-icons/fa';
import SharePostButton from './SharePostButton';
import PostPopularityButton from './PostPopularityButton';

const PostActions = ({ post, comments, onShowComments }) => {
  return (
    <div className="flex items-center justify-between gap-4 text-xs md:text-sm text-gray-500 border-t pt-3">
      <div className="flex items-center gap-2">
        <PostPopularityButton 
          postId={post._id} 
          size="default"
          showCount={true}
        />
        <button 
          onClick={() => onShowComments(post._id)}
          className="flex items-center gap-3 hover:text-orange-500 transition-colors cursor-pointer bg-gray-50 p-2 px-4 rounded-xl outline"
          title='View Comments'
        >
          <FaComments /> 
          {typeof post.commentCount === 'number' ? post.commentCount : (comments[post._id]?.length || 0)}
        </button>
    </div>
    <div>
        <SharePostButton post={post} />
    </div>
    </div>
  );
};

export default PostActions;