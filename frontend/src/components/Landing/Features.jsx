import React from "react";
import { Link } from "react-router-dom";
import {
  FaLightbulb,
  FaHandsHelping,
  FaStar,
  FaShieldAlt,
  FaRocket,
  FaBookOpen,
  FaEnvelope,
} from "react-icons/fa"; // Import FaRocket

function Features() {
  const siteFeatures = [
    {
      title: "Share Your Thoughts",
      description:
        "Post your ideas, questions, and insights to engage with the community and spark meaningful discussions.",
      icon: <FaLightbulb />,
      color: "bg-blue-400/20",
    },
    {
      title: "Community Interaction",
      description:
        "Comment on posts, engage in discussions, and build connections with like-minded individuals.",
      icon: <FaHandsHelping />,
      color: "bg-green-400/20",
    },
    {
      title: "Popularity System",
      description:
        "Earn popularity through quality posts and helpful comments. Your contributions are recognized and rewarded.",
      icon: <FaStar />,
      color: "bg-yellow-400/20",
    },
    {
      title: "Admin Moderation",
      description:
        "Enjoy a safe and well-moderated environment with active admin supervision and user verification.",
      icon: <FaShieldAlt />,
      color: "bg-red-400/20",
    },

    {
      title: "Resources Hub",
      description:
        "Access a comprehensive library of educational resources, tutorials, and study materials curated by the community.",
      icon: <FaBookOpen />,
      color: "bg-orange-400/20",
    },
    {
      title: "Contact Admin System",
      description:
        "Direct communication channel with administrators for support, feedback, and platform-related inquiries.",
      icon: <FaEnvelope />,
      color: "bg-indigo-400/20",
    },
  ];

  return (
    <div className="font-Jost relative slide-in">
      {/* Background decorative elements */}
      <div
        className="absolute top-[20%] left-[20%] w-48 h-48 bg-teal-400/10 rounded-full animate-pulse blur-2xl"
        style={{ animationDuration: "8s" }}
      ></div>
      <div
        className="absolute bottom-[30%] right-[20%] w-80 h-80 bg-pink-400/10 rounded-full animate-pulse blur-2xl"
        style={{ animationDuration: "10s" }}
      ></div>
      <div
        className="absolute top-[40%] left-[5%] w-72 h-72 bg-indigo-400/10 rounded-full animate-pulse blur-2xl"
        style={{ animationDuration: "12s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-Saira font-bold text-gray-900 mb-4">
            Discover Our Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-Jost">
            Explore the powerful features that make SitVerse the perfect
            platform for connecting, sharing, and growing together as a
            community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {siteFeatures.map((feature, index) => (
            <div
              key={index}
              className="group mx-auto hover:bg-white/70 bg-white/40 rounded-lg 
              scroll-view backdrop-blur-sm shadow-2xl flex flex-col items-center
              transition-all duration-300 ease-in-out transform hover:scale-105
              grayscale-25 hover:filter-none"
            >
              {/* Feature card content */}
              <div className="p-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-3xl">
                    {feature.icon} {/* Render React Icon */}
                  </span>
                </div>

                <h3 className="text-2xl font-Saira font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 font-Jost leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <Link to={"/login"}>
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-Jost font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
              <span>Experience These Features</span>
              <FaRocket className="text-xl" />{" "}
              {/* Replaced emoji with React Icon */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Features;
