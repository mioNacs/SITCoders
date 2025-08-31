import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaStar } from 'react-icons/fa';
import { usePopularity } from '../../context/PopularityContext';

const ProfileCard = ({ user, isAdmin, adminLoading }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {fetchUserReputation, getTotalReputation} = usePopularity();

  useEffect(() => {
      if (user._id) {
        loadReputation();
      }
    }, [user._id]);
  
    const loadReputation = async () => {
      try {
        setIsLoading(true);
        await fetchUserReputation(user._id);
      } catch (err) {
        console.error("Error loading reputation:", err);
      } finally {
        setIsLoading(false);
      }
    };

  const totalReputation = getTotalReputation(user._id);

  return (
    <div className="bg-white rounded-2xl border border-orange-300 p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-300 to-amber-400 blur-sm -z-10 transform scale-110"></div>
          {user?.profilePicture?.url ? (
            <img
              src={user.profilePicture.url}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400 border-2 border-white shadow-md rounded-full" />
          )}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          {user?.fullName || user?.username || "User"}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-amber-500">
          <FaStar />
          <span className="text-gray-700">
            Reputation: {isLoading ? "..." : totalReputation}
          </span>
        </div>
        {!adminLoading && isAdmin && (
          <div className="mt-2 bg-blue-100 border text-blue-500 px-3 py-1 rounded-full text-sm font-medium">
            Administrator
          </div>
        )}
        <Link 
          to={"/profile"} 
          className="text-center mt-4 w-full bg-orange-100 text-orange-600 border hover:bg-orange-200 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
        >
          Your Profile
        </Link>
        <Link 
          to={"/leaderboard"} 
          className="text-center mt-2 w-full bg-orange-100 text-orange-600 border hover:bg-orange-200 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;