import React, { useState, useEffect } from 'react';
import './FinDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FinDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [approvedUsers, setApprovedUsers] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Fetch approved users (those with approved documents)
  const fetchApprovedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/approved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setApprovedUsers(response.data);
    } catch (error) {
      console.error('Error fetching approved users:', error);
    }
  };

  useEffect(() => {
    fetchApprovedUsers();
  }, []);

  const handlePushToDbt = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/users/push-to-dbt/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Push to DBT successful:', response.data);
      alert('Pushed to DBT and email sent successfully.');
    } catch (error) {
      console.error('Error pushing to DBT:', error);
    }
  };

  return (
    <div className="dashboard">
      <nav>
        <h1>Finance Bureau Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      {approvedUsers.length === 0 ? (
        <p>No approved users available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>PMSID</th>
              <th>Student Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.sid}</td>
                <td>{user.name}</td>
                <td>
                  <button className="push-btn" onClick={() => handlePushToDbt(user._id)}>Push to DBT</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinDashboard;
