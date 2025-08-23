import React, { useEffect, useState } from "react";
import { usePopularity } from "../../context/PopularityContext";
import { FaTrophy } from "react-icons/fa";
import ProfilePopularityButton from "./ProfilePopularityButton";

const ReputationDisplay = ({
  userId,
  compact = false,
  isOwnProfile = false,
}) => {
  const {
    fetchUserReputation,
    getUserReputationData,
    getTotalReputation,
    getReputationBreakdown,
  } = usePopularity();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    if (userId) {
      loadReputation();
      setShowBreakdown(false)
    }
  }, [userId]);

  // Handler for scroll
  useEffect(() => {
    if (!showBreakdown) return;
    const handleScroll = () => setShowBreakdown(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBreakdown]);
  
  const loadReputation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchUserReputation(userId);
    } catch (err) {
      setError("Failed to load reputation");
      console.error("Error loading reputation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalReputation = getTotalReputation(userId);
  const breakdown = getReputationBreakdown(userId);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}>
        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
        <span className="text-gray-500">Loading reputation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 ${compact ? "text-sm" : ""}`}>{error}</div>
    );
  }

  if (totalReputation === 0 && !getUserReputationData(userId)) {
    return null; // Don't show anything if no data
  }

  // Compact display for cards and smaller spaces
  if (compact) {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <FaTrophy className="w-3 h-3 text-yellow-500" />
        <span className="font-medium">{totalReputation}</span>
      </div>
    );
  }

  // Full display with optional breakdown
  // Handler for background click
  const handleBackgroundClick = (e) => {
    // Only close if clicking outside the breakdown box
    if (showBreakdown && e.target.classList.contains('breakdown-bg')) {
      setShowBreakdown(false);
    }
  };


  return (
    <div>
      <div className="flex items-center md:text-lg justify-center gap-3 mb-3">
        {/* Profile Popularity Button */}
        {!isOwnProfile && (
          <div className="flex justify-center">
            <ProfilePopularityButton
              profileId={userId}
              size="default"
              showCount={true}
            />
          </div>
        )}
        <button 
        className="font-semibold  text-gray-500 hover:text-orange-400 transition-all hover:underline cursor-pointer"
        onClick={() => setShowBreakdown(!showBreakdown)}
        title={showBreakdown ? "Hide Breakdown" : "Show Breakdown"}
        >
          <h3>Reputation: {totalReputation}</h3>
        </button>
      </div>
      {showBreakdown && breakdown && (
        <div className="fixed inset-0 z-20 breakdown-bg" onClick={handleBackgroundClick} style={{cursor:'pointer'}}>
          <div className="fixed left-[5%] mr-[5%] top-100 bg-white rounded-lg p-3 border" onClick={e => e.stopPropagation()}>
            <div className="gap-y-2">
              <h4 className="font-medium text-gray-700 mb-2 underline">
                Reputation Breakdown
              </h4>
              <div className="sm:grid flex grid-cols-1 sm:grid-cols-3 text-center gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div>
                    <div className="font-medium">Profile Popularity</div>
                    <div className="text-gray-600">
                      {breakdown.profilePopularity}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div>
                    <div className="font-medium">Post Popularity</div>
                    <div className="text-gray-600">
                      {breakdown.postsPopularity}
                      {breakdown.totalPosts > 0 && (
                        <span className="text-xs text-gray-500 block">
                          ({breakdown.avgPostPopularity} avg)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div>
                    <div className="font-medium">Comment Popularity</div>
                    <div className="text-gray-600">
                      {breakdown.commentsPopularity}
                      {breakdown.totalComments > 0 && (
                        <span className="text-xs text-gray-500 block">
                          ({breakdown.avgCommentPopularity} avg)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="pt-2 text-xs text-gray-500">
                Based on {breakdown.totalPosts} posts and{" "}
                {breakdown.totalComments} comments
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReputationDisplay;
