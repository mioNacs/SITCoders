import React from "react";
import { FaUsers, FaBell } from 'react-icons/fa';

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
    <div className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-Saira font-extrabold text-gray-900">
            Upcoming Updates
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Exciting new features are on the way. Here's what we're building to enhance your SITCoders experience.
          </p>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plannedUpdates.map((update, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-start transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className="text-3xl text-orange-500">
                  {update.icon}
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {update.expectedRelease}
                </span>
              </div>

              <h3 className="text-xl font-Saira font-bold text-gray-900 mb-3">
                {update.feature}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {update.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingUpdates;