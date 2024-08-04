import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'; // Make sure to include any specific CSS if needed

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect or show a message if the user is not authenticated
  }

  return (
    <div className="profile-container">
      <img src={user.picture} alt={user.name} className="profile-picture" />
      <h2 className="profile-name">{user.name}</h2>
      <p className="profile-email">{user.email}</p>

      <button 
        className="profile-button" 
        onClick={() => navigate("/home")} // Redirect to Home page
      >
        Go to Home
      </button>
      
      <button 
        className="profile-button" 
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
