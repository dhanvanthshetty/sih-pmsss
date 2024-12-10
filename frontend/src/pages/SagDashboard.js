import React, { useState, useEffect } from 'react';
import './SagDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SagDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const fetchSubmittedDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/documents/submitted', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchSubmittedDocuments();
  }, []);

  const handleView = (filePath) => {
    window.open(`http://localhost:5000/${filePath}`, '_blank');
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. User not authenticated.');

      const response = await axios.post(
        'http://localhost:5000/api/documents/approve',
        { userId },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      console.log('Document approved successfully:', response.data);
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/users/reject/${selectedUserId}`, {
        feedback
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('User rejected:', response.data);
      setModalOpen(false);
      setFeedback('');
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const openRejectModal = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFeedback('');
  };

  const groupDocumentsByUser = () => {
    const grouped = {};
    documents.forEach((doc) => {
      if (!grouped[doc.userId._id]) {
        grouped[doc.userId._id] = {
          sid: doc.userId.sid,
          name: doc.userId.name,
          documents: []
        };
      }
      grouped[doc.userId._id].documents.push(doc);
    });
    return grouped;
  };

  const groupedDocuments = groupDocumentsByUser();

  return (
    <div className="dashboard">
      <nav>
        <h1>Sage Bureau Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      {Object.keys(groupedDocuments).length === 0 ? (
        <p>No submitted documents available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>PMSID</th>
              <th>Student Name</th>
              <th>Document Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedDocuments).map((userId) => {
              const user = groupedDocuments[userId];
              return (
                <React.Fragment key={userId}>
                  <tr>
                    <td>{user.sid}</td>
                    <td>{user.name}</td>
                    <td colSpan="2"></td>
                  </tr>
                  {user.documents.map((doc) => (
                    <tr key={doc._id}>
                      <td></td>
                      <td></td>
                      <td>{doc.type}</td>
                      <td>
                        <button className="view-btn" onClick={() => handleView(doc.filePath)}>View</button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2"></td>
                    <td colSpan="2">
                      <button className="approve-btn" onClick={() => handleApprove(userId)}>Approve</button>
                      <button className="reject-btn" onClick={() => openRejectModal(userId)}>Reject</button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Reject Document</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback for rejection..."
            />
            <div className="modal-buttons">
              <button onClick={handleReject}>Reject</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SagDashboard;
