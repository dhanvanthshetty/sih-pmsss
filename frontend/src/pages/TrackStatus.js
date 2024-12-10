// import React, { useState, useEffect } from 'react';
// import './TrackStatus.css';
// import axios from 'axios';

// const stages = [
//   { id: 'applicationSubmitted', label: 'Application Submitted' },
//   { id: 'approvedBySigBureau', label: 'SIG Bureau' },
//   { id: 'pushedToDbt', label: 'Finance Bureau' },
// ];

// const ApplicationTracking = () => {
//   const [currentStage, setCurrentStage] = useState(0);
//   const [timestamps, setTimestamps] = useState({});
//   const [error, setError] = useState('');
//   const [noData, setNoData] = useState(false);

//   // Fetch application status from the API
//   const fetchStatus = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Fetch token from localStorage
//       if (!token) throw new Error('No token found. Please log in.');

//       const response = await axios.get('http://localhost:5000/api/application-status', {
//         headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
//       });

//       const { applicationSubmitted, approvedBySigBureau, pushedToDbt, timestamps } = response.data;

//       const stagesCompleted = [
//         applicationSubmitted,
//         approvedBySigBureau,
//         pushedToDbt,
//       ].filter(stage => stage).length;

//       setCurrentStage(stagesCompleted); // Set current stage based on completion
//       setTimestamps({
//         submittedAt: timestamps.submittedAt ? new Date(timestamps.submittedAt).toLocaleString() : null,
//         approvedAt: timestamps.approvedAt ? new Date(timestamps.approvedAt).toLocaleString() : null,
//         pushedAt: timestamps.pushedAt ? new Date(timestamps.pushedAt).toLocaleString() : null,
//       });

//       setNoData(false); // Reset no data if valid response
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setNoData(true); // Set no data message if application not found
//       } else {
//         setError('Error fetching status.');
//       }
//     }
//   };

//   useEffect(() => {
//     fetchStatus(); // Fetch status when component mounts
//   }, []);

//   return (
//     <div className="container">
//       <h1>Application Tracking</h1>
//       {error && <p className="error">{error}</p>}
//       {noData && <p className="no-data">No application status found.</p>}
//       <div className="status-container-vertical">
//         {stages.map((stage, index) => (
//           <React.Fragment key={stage.id}>
//             <div className={`status ${currentStage > index ? 'green' : ''}`} id={stage.id}>
//               <p>{stage.label}</p>
              
//             </div>
//             {index < stages.length - 1 && (
//               <div className={`line ${currentStage > index ? 'green' : ''}`} id={`line${index + 1}`}></div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ApplicationTracking;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrackStatus.css';

// Define the stages of application tracking
const stages = [
  { id: 'applicationSubmitted', label: 'Application Submitted' },
  { id: 'approvedBySigBureau', label: 'Approved by SIG Bureau' },
  { id: 'pushedToDbt', label: 'Pushed to Finance Bureau (DBT)' },
];

const ApplicationTracking = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [timestamps, setTimestamps] = useState({});
  const [error, setError] = useState('');
  const [noData, setNoData] = useState(false);

  // Fetch application status from the API
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) throw new Error('No token found. Please log in.');

      // Replace API_URL with your backend API URL
      const response = await axios.get('http://localhost:5000/api/application-status', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { pushedToDbt, approvedBySigBureau, applicationSubmitted, timestamps } = response.data;

      const stagesCompleted = [
        applicationSubmitted,
        approvedBySigBureau,
        pushedToDbt,
      ].filter(Boolean).length;

      setCurrentStage(stagesCompleted); // Update the current stage
      setTimestamps({
        submittedAt: timestamps?.submittedAt ? new Date(timestamps.submittedAt).toLocaleString() : null,
        approvedAt: timestamps?.approvedAt ? new Date(timestamps.approvedAt).toLocaleString() : null,
        pushedAt: timestamps?.pushedAt ? new Date(timestamps.pushedAt).toLocaleString() : null,
      });

      setNoData(false); // Reset no data flag
    } catch (err) {
      if (err.response?.status === 404) {
        setNoData(true); // No application status found
      } else {
        setError('Error fetching application status.');
      }
    }
  };

  useEffect(() => {
    fetchStatus(); // Fetch status on component mount
  }, []);

  return (
    <div className="container">
      <h1>Application Tracking</h1>
      {error && <p className="error">{error}</p>}
      {noData && <p className="no-data">No application status found.</p>}
      <div className="status-container-vertical">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className={`status ${currentStage > index ? 'green' : ''}`} id={stage.id}>
              <p>{stage.label}</p>
              {timestamps[`${stage.id}At`] && (
                <small>{timestamps[`${stage.id}At`]}</small>
              )}
            </div>
            {index < stages.length - 1 && (
              <div
                className={`line ${currentStage > index ? 'green' : ''}`}
                id={`line${index + 1}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracking;
