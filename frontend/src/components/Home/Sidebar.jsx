import React from 'react';
import ProfileCard from './ProfileCard';
import UserPostsCard from './UserPostsCard';

const Sidebar = ({ 
  user, 
  isAdmin, 
  adminLoading, 
  userPostsCount, 
  onCreatePost 
}) => {
  return (
    <div className="md:w-1/3 hidden md:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex flex-col gap-6">
          <ProfileCard 
            user={user} 
            isAdmin={isAdmin} 
            adminLoading={adminLoading} 
          />
          <UserPostsCard 
            user={user} 
            userPostsCount={userPostsCount} 
            onCreatePost={onCreatePost} 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;