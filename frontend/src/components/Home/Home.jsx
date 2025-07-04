import React from "react";
import { FaUser, FaFire, FaClipboard } from "react-icons/fa";

function Home() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  return (
    <div className="pt-20 min-h-screen bg-orange-50">
      <div className="flex flex-col md:flex-row gap-6 md:max-w-[90%] lg:max-w-[80%] mx-auto pb-8 px-4 md:px-0">
        {/* Main Content Area */}
        <div className="md:w-2/3 h-full flex flex-col gap-4 bg-white rounded-2xl shadow-md border border-orange-100 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 border-orange-100">Feed</h2>
          <div className="text-gray-600">
            Your content will appear here
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/3 h-full flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-300 to-amber-400 blur-sm -z-10 transform scale-110"></div>
                <img
                  src={
                    user?.profilePicture ||
                    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">{user?.username || "User"}</h3>
              <div className="mt-2 flex items-center gap-2 text-amber-500">
                <FaFire />
                <span className="text-gray-700">Popularity: <span className="font-medium">{user?.popularity || 0}</span></span>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                Your Profile
              </button>
            </div>
          </div>
          
          {/* Posts Card */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaClipboard className="text-amber-500" />
              <h3 className="text-xl font-semibold text-gray-800">Your Posts</h3>
            </div>
            <div className="text-gray-600 text-sm">
              You haven't created any posts yet.
            </div>
            <button className="mt-4 w-full border border-orange-300 text-orange-500 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all">
              Create New Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
