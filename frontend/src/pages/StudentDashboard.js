import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css'; // Import CSS file for styling

function StudentDashboard() {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleUpload = () => {
    navigate('/upload-documents');
  };

  const handleTrackStatus = () => {
    navigate('/track-status');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="student-dashboard">
      <h1>Welcome to the Student Dashboard</h1>
      <div className="dashboard-options">
        <button onClick={handleProfile} className="dashboard-btn">Profile</button>
        <button onClick={handleUpload} className="dashboard-btn">Upload Documents</button>
        <button onClick={handleTrackStatus} className="dashboard-btn">Track Status</button>
        <button onClick={handleLogout} className="dashboard-btn">Logout</button>
      </div>
    </div>
  );
}

export default StudentDashboard;
