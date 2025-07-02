import React from "react";

function UserProfile() {
  const userData = localStorage.getItem("user") || {};
  const user = userData ? JSON.parse(userData) : "";

  return (
    <div className="pt-20 user-profile-container flex justify-center h-screen items-center text-lg">
      <div className="profile-details">
        <div className="detail-item">
          <span>Full Name: </span>
          <span>{user.fullName || "Not available"}</span>
        </div>

        <div className="detail-item">
          <span>Username: </span>
          <span>{user.username || "Not available"}</span>
        </div>

        <div className="detail-item">
          <span>Roll No: </span>
          <span>{user.rollNo || "Not available"}</span>
        </div>

        <div className="detail-item">
          <span>Email: </span>
          <span>{user.email || "Not available"}</span>
        </div>

        <div className="detail-item">
          <span>Gender: </span>
          <span>{user.gender || "Not available"}</span>
        </div>

        <div className="detail-item">
          <span>Popularity: </span>
          <span>{user.popularity || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
