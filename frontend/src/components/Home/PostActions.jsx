import React from 'react';
import { FaComments, FaArrowRight } from 'react-icons/fa';
import SharePostButton from './SharePostButton';

const PostActions = ({ post, comments, onShowComments }) => {
  return (
    <div className="flex items-center justify-end gap-4 text-xs md:text-sm text-gray-500 border-t pt-3">
      <SharePostButton post={post} />
      <button 
        onClick={() => onShowComments(post._id)}
        className="flex items-center gap-3 hover:text-orange-500 transition-colors cursor-pointer bg-gray-50 p-2 px-4 rounded-xl outline"
      >
        <FaComments /> 
        {comments[post._id]?.length || 0}
        <FaArrowRight />
      </button>
    </div>
  );
};

export default PostActions;