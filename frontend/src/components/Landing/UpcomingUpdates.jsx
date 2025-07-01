import React from "react";

function UpcomingUpdates() {
  const plannedUpdates = [
    {
      feature: "Post your queries",
      description:
        "Users will be able to post their queries and get answers from the community.",
      expectedRelease: "Q3 2025",
      icon: "🗨️", // Chat/message bubble icon
    },
    {
      feature: "Project Guidance",
      description:
        "Get step-by-step guidance on your projects from peers and admins.",
      expectedRelease: "Q3 2025",
      icon: "🛠️", // Hammer and wrench icon
    },
    {
      feature: "Star-popularity system",
      description:
        "A system to rate your post and comments that will accumulate to your popularity.",
      expectedRelease: "Q4 2025",
      icon: "⭐", // Star icon
    },
  ];

  return (
    <div>
      <div className="relative flex flex-col md:flex-row md:grid-cols-2 select-none md:justify-between md:mx-10 lg:mx-25 font-Jost items-center justify-center min-h-screen">
        {/* Teal shape */}
        <div
          className="absolute top-[25%] right-[30%] w-64 h-64 bg-orange-800/20 rounded-tr-[50%] rounded-bl-[50%] animate-pulse blur-xl"
          style={{ animationDuration: "4s" }}
        ></div>

        {/* Blue circle */}
        <div
          className="absolute bottom-[5%] right-[35%] w-72 h-72 rounded-full bg-blue-400/20 animate-bounce blur-md"
          style={{ animationDuration: "10s" }}
        ></div>

        {/* Purple shape */}
        <div
          className="absolute top-[45%] right-[8%] w-64 h-64 bg-purple-500/20 rounded-tr-[50%] rounded-bl-[50%] animate-spin blur-xl"
          style={{ animationDuration: "15s" }}
        ></div>

        <div className="md:w-1/2 text-center">
          <h1 className="text-4xl font-Saira font-medium text-center mb-4">
            Upcoming Updates
          </h1>
        </div>
        <div>
          {plannedUpdates.map((update, index) => (
            <div
              key={index}
              className="relative bg-white/50 m-2 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-lg shadow-md slide-in backdrop-blur-sm"
            >
              <div className="backdrop-blur-sm p-4 ">
                <h2 className="text-2xl font-semibold mb-2">
                  <span fill="black">{update.icon}</span> {update.feature}
                </h2>
                <p className="text-gray-700 mb-2">{update.description}</p>
                <p className="text-sm text-gray-500">
                  Expected Release: {update.expectedRelease}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingUpdates;
