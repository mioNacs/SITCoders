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
} from "react-icons/fa";

function Features() {
  const siteFeatures = [
    {
      title: "Share Your Thoughts",
      description:
        "Post your ideas, questions, and insights to engage with the community and spark meaningful discussions.",
      icon: <FaLightbulb />,
      color: "text-blue-500",
    },
    {
      title: "Community Interaction",
      description:
        "Comment on posts, engage in discussions, and build connections with like-minded individuals.",
      icon: <FaHandsHelping />,
      color: "text-green-500",
    },
    {
      title: "Popularity System",
      description:
        "Earn recognition through quality posts and helpful comments. Your contributions are valued and rewarded.",
      icon: <FaStar />,
      color: "text-yellow-500",
    },
    {
      title: "Admin Moderation",
      description:
        "Enjoy a safe and well-moderated environment with active admin supervision and user verification.",
      icon: <FaShieldAlt />,
      color: "text-red-500",
    },
    {
      title: "Resources Hub",
      description:
        "Access a comprehensive library of educational resources, tutorials, and study materials curated by the community.",
      icon: <FaBookOpen />,
      color: "text-orange-500",
    },
    {
      title: "Contact Admin System",
      description:
        "Direct communication channel with administrators for support, feedback, and platform-related inquiries.",
      icon: <FaEnvelope />,
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-Saira font-extrabold text-gray-900">
            Discover Our Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the powerful tools that make SITCoders the perfect
            platform for connecting, sharing, and growing together.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-start transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`text-4xl mb-5 ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-Saira font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <Link
            to="/signup"
            className="inline-flex items-center space-x-3 bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Join the Community</span>
            <FaRocket />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Features;
