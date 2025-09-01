import React from "react";
import { FaUsers, FaBell } from 'react-icons/fa'; // Removed unused icons

function UpcomingUpdates() {
  const plannedUpdates = [
    {
      feature: "Collaboration Platform",
      description:
        "Connect and collaborate with peers on projects, find study partners, and create team-based learning experiences.",
      expectedRelease: "Q4 2025",
      icon: <FaUsers />,
    },
    {
      feature: "Real-time Notifications",
      description:
        "Stay updated with instant notifications for comments, likes, collaboration requests, and admin announcements.",
      expectedRelease: "Q4 2025",
      icon: <FaBell />,
    },
  ];

  return (
    <div className="py-20 font-Jost relative slide-in">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background decorative elements */}
        <div
          className="absolute top-[15%] right-[20%] w-64 h-64 bg-orange-500/10 rounded-full animate-pulse blur-xl"
          style={{ animationDuration: "8s" }}
        ></div>

        <div
          className="absolute bottom-[10%] left-[15%] w-72 h-72 rounded-full bg-blue-400/10 animate-pulse blur-xl"
          style={{ animationDuration: "12s" }}
        ></div>

        <div
          className="absolute top-[40%] right-[8%] w-64 h-64 bg-purple-500/10 rounded-full animate-pulse blur-xl"
          style={{ animationDuration: "10s" }}
        ></div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-Saira font-bold text-gray-900 mb-4">
            Upcoming Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-Jost">
            Exciting new features and improvements are on the way. Here's what we're working on to enhance your SitVerse experience.
          </p>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plannedUpdates.map((update, index) => (
            <div
              key={index}
              className="group mx-auto hover:bg-white/70 bg-white/40 rounded-lg 
              scroll-view backdrop-blur-sm shadow-2xl flex flex-col items-center
              transition-all duration-300 ease-in-out transform hover:scale-105
              grayscale-25 hover:filter-none"
            >
              <div className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4 group-hover:scale-110 transition-transform duration-300 text-blue-600 text-3xl">
                  {update.icon}
                </div>

                <h3 className="text-xl font-Saira font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {update.feature}
                </h3>

                <p className="text-gray-600 font-Jost leading-relaxed mb-4 text-sm">
                  {update.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {update.expectedRelease}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default UpcomingUpdates;