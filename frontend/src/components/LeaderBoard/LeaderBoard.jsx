import React from "react";
import { usePopularity } from "../../context/PopularityContext";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function LeaderBoard() {
  const {
    fetchLeaderboard,
    leaderboard,
    leaderboardLoading,
    leaderboardError,
  } = usePopularity();

  // Local UI state
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Fetch once on mount
  React.useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Update timestamp whenever leaderboard changes
  React.useEffect(() => {
    if (leaderboard && leaderboard.length > 0) {
      setLastUpdatedAt(new Date());
    }
  }, [leaderboard]);

  // Refresh wrapper
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchLeaderboard();
      setLastUpdatedAt(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper for top-3 glow effect
  const getGlowBorderClass = (index) => {
    if (index === 0)
      return "shadow-[0_0_16px_4px_rgba(255,193,7,0.5)] border-yellow-300";
    if (index === 1)
      return "shadow-[0_0_10px_2px_rgba(128,128,128,0.2)] border-gray-400";
    if (index === 2)
      return "shadow-[0_0_12px_3px_rgba(255,87,34,0.1)] border-orange-300";
    return "border-gray-200";
  };

  return (
    <div className="bg-orange-50 min-h-screen pt-16">
      <div className="md:max-w-[90%] h-full lg:max-w-[80%] mx-auto">
        <div className="mx-auto px-2 pb-4 max-w-3xl text-center">
          {/* Header */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-start">
              <h1 className="mt-4 text-3xl font-bold text-orange-600">
                Leaderboard
              </h1>
              <p className="text-gray-600">Top 20 users by reputation</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={leaderboardLoading || isRefreshing}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60"
                aria-label="Refresh leaderboard"
                title="Refresh leaderboard"
              >
                {isRefreshing || leaderboardLoading ? "Refreshing..." : "Refresh"}
              </button>

              <div className="text-xs text-gray-500">
                {lastUpdatedAt
                  ? `Updated: ${lastUpdatedAt.toLocaleString()}`
                  : "Not updated yet"}
              </div>
            </div>
          </div>

          {/* Accessible live region for screen readers */}
          <div aria-live="polite" className="sr-only">
            {leaderboardLoading
              ? "Leaderboard loading"
              : leaderboardError
              ? `Error: ${leaderboardError}`
              : `Loaded ${leaderboard?.length ?? 0} users`}
          </div>

          {/* Error message */}
          {leaderboardError && (
            <div className="py-4 text-red-600" role="alert">
              {leaderboardError}
            </div>
          )}

          {/* Empty state */}
          {!leaderboardLoading &&
            !leaderboardError &&
            (!leaderboard || leaderboard.length === 0) && (
              <div className="py-8 text-gray-500">
                No leaderboard data available.
              </div>
            )}

          {/* Loading skeleton */}
          {leaderboardLoading && (
            <div className="mt-6 space-y-3 w-full">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex items-center gap-4 bg-white rounded-lg p-3 shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 rounded w-3/5" />
                    <div className="h-3 bg-gray-200 rounded w-2/5" />
                  </div>
                  <div className="w-12 h-5 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard user cards */}
          {!leaderboardLoading && leaderboard && leaderboard.length > 0 && (
            <div className="mt-6 space-y-4">
              {leaderboard.map((user, index) => {
                const userRank = index + 1;
                const isTopThree = index < 3;

                const userReputation =
                  typeof user.totalReputation === "number"
                    ? user.totalReputation
                    : user.totalReputation ?? "—";

                const highestReputation = leaderboard.reduce((max, currentUser) => {
                  const currentReputation =
                    typeof currentUser.totalReputation === "number"
                      ? currentUser.totalReputation
                      : 0;
                  return currentReputation > max ? currentReputation : max;
                }, 0);

                const reputationPercentage =
                  highestReputation > 0 && typeof userReputation === "number"
                    ? Math.round((userReputation / highestReputation) * 100)
                    : 0;

                return (
                <Link 
                to={`/profile/${user.username}`}>
                  <div
                    key={user._id || user.userId}
                    className={`bg-white rounded-xl p-5 my-2 shadow-lg hover:shadow-xl transition-colors hover:bg-orange-50 focus-within:ring-2 focus-within:ring-orange-200 border ${
                      isTopThree ? getGlowBorderClass(index) : "border-gray-200"
                    }`}
                    tabIndex={0}
                    title={`visit ${user.username || "Unknown"}'s profile`}
                  >
                    <div className="flex justify-between">
                      {/* Left Section: Rank + Avatar + User Info */}
                      <div className="flex items-center gap-2 md:gap-4">
                        {/* Rank */}
                        <div
                          className={`flex flex-col items-center justify-center font-bold px-2 ${
                            isTopThree
                              ? "text-orange-600"
                              : "text-gray-600"
                          }`}
                        >
                          <div className="text-2xl">{userRank}</div>
                          {isTopThree && (
                            <div
                              className="mt-1 w-3 h-3 rounded-full bg-yellow-300 animate-pulse shadow-lg"
                              aria-label="Top rank"
                            />
                          )}
                        </div>

                        {/* Avatar */}
                        {user.profilePicture?.url ? (
                          <img
                            src={user.profilePicture.url}
                            alt={user.fullName || user.username || "User avatar"}
                            className={`w-14 h-14 object-cover rounded-full border ${
                              isTopThree ? getGlowBorderClass(index) : "border-gray-200"
                            } shadow-sm`}
                          />
                        ) : (
                          <div
                            className={`w-14 h-14 object-cover rounded-full border flex items-center justify-center overflow-hidden bg-white ${
                              isTopThree ? getGlowBorderClass(index) : "border-gray-200"
                            }`}
                          >
                            <FaRegUserCircle className="w-8 h-8 text-gray-400" />
                          </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1 text-left">
                          <div
                            className={`font-semibold text-lg truncate max-w-[18rem] ${
                              isTopThree ? "text-orange-600" : "text-gray-800"
                            }`}
                            title={user.fullName || "Unknown"}
                          >
                            {user.fullName || "Unknown"}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate max-w-[18rem]"
                            title={user.username}
                          >
                            {user.username ? `@${user.username}` : "No username"}
                          </div>
                        </div>
                      </div>

                      {/* Right Section: Reputation */}
                      <div className="text-right">
                        <div
                          className={`inline font-semibold md:text-xl ${
                            isTopThree ? "text-orange-600" : "text-orange-500"
                          }`}
                        >
                          Reputation: {userReputation}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {reputationPercentage
                            ? `${reputationPercentage}% of top`
                            : "—"}
                        </div>
                        <div className="h-2 bg-orange-50 rounded-full overflow-hidden mt-1">
                          <div
                            style={{ width: `${reputationPercentage}%` }}
                            className="h-2 rounded-full bg-orange-300"
                            aria-hidden
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
