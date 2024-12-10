// src/services/apiService.js
const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

export const fetchProtectedData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/protected-route`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching protected data:', error);
    throw error;
  }
};


// Fetch submitted applications for Sage Bureau
export const getSubmittedApplications = async () => {
  const response = await fetch('/api/sage/submitted-applications', { method: 'GET' });
  return response.json();
};

// Approve application (Sage Bureau)
export const approveApplication = async (studentId) => {
  const response = await fetch(`/api/sage/approve/${studentId}`, { method: 'POST' });
  return response.json();
};

// Fetch approved applications (Finance Bureau)
export const getApprovedApplications = async () => {
  const response = await fetch('/api/finance/approved-applications', { method: 'GET' });
  return response.json();
};

// Push application to DBT (Finance Bureau)
export const pushToDBT = async (studentId) => {
  const response = await fetch(`/api/finance/push/${studentId}`, { method: 'POST' });
  return response.json();
};
