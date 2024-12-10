import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/authService';
import './Profile.css'; // Import the CSS file for styling

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="profile-error">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {/* Avatar or Placeholder */}
          <div className="avatar-initials">{profile.name.charAt(0)}</div>
        </div>
        <div className="profile-details">
          <h1>{profile.name}</h1>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile}</p>
          <p><strong>Aadhar Number:</strong> {profile.aadharNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
