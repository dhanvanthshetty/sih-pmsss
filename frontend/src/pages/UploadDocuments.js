import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadDocuments.css';

function UploadDocuments() {
  const [submitComplete, setSubmitComplete] = useState(false);
  const [documents, setDocuments] = useState({
    testCard: { file: null, progress: 0, saved: false },
    marksheet: { file: null, progress: 0, saved: false },
    feesReceipt: { file: null, progress: 0, saved: false },
    collegeID: { file: null, progress: 0, saved: false },
  });
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await axios.get('http://localhost:5000/api/documents/retrieve', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const savedDocs = response.data; // Assuming this is an array of documents
        
        if (savedDocs.length === 0) {
          // Handle the case when no documents are found
        } else {
          const newDocs = { ...documents };
          
          savedDocs.forEach(doc => {
            if (newDocs[doc.type]) {
              newDocs[doc.type] = {
                file: doc.filePath,
                progress: 100,
                saved: true,
              };
            }
          });
    
          setDocuments(newDocs);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error retrieving documents:', error.response?.data || error.message);
        }
      }
    }
  
    fetchDocuments();// eslint-disable-next-line
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    setDocuments({
      ...documents,
      [name]: { file, progress: 0, saved: false },
    });

    simulateProgress(name);
  };

  const simulateProgress = (docType) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
      } else {
        progress += 10;
        setDocuments((prevDocs) => ({
          ...prevDocs,
          [docType]: { ...prevDocs[docType], progress },
        }));
      }
    }, 500);
  };

  const handleSave = async (docType) => {
    if (!documents[docType].file) return;

    const formData = new FormData();
    formData.append(docType, documents[docType].file);

    try {
      const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDocuments((prevDocs) => ({
        ...prevDocs,
        [docType]: { ...prevDocs[docType], saved: true },
      }));
      console.log(`${docType} uploaded successfully:`, response.data);
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error.response?.data || error.message);
    }
  };

  const handleSubmit = async () => {
    const allDocumentsSaved = Object.keys(documents).every(docType => documents[docType].saved);

    if (allDocumentsSaved) {
      setUploadStatus('All documents have already been submitted.');
      return;
    }

    const formData = new FormData();
    Object.keys(documents).forEach((docType) => {
      if (documents[docType].file && !documents[docType].saved) {
        formData.append(docType, documents[docType].file);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUploadStatus('All documents submitted successfully');
      setSubmitComplete(true); // Mark submit as completed
      console.log('Documents submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting documents:', error.response?.data || error.message);
      setUploadStatus('Error submitting documents');
    }
  };

  const handleDelete = async (docType) => {
    if (!documents[docType].saved || submitComplete) return; // Disable delete if submit is complete
    try {
      await axios.delete('http://localhost:5000/api/documents/delete', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: { type: docType } // Pass document type to delete
      });

      setDocuments({
        ...documents,
        [docType]: { file: null, progress: 0, saved: false },
      });
      console.log(`${docType} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${docType}:`, error.response?.data || error.message);
    }
  };

  return (
    <div className="upload-documents">
      <h1>Upload Documents</h1>
      <div className="document-upload">
        {['testCard', 'marksheet', 'feesReceipt', 'collegeID'].map((docType) => (
          <div key={docType} className="document-item">
            <label htmlFor={docType} className="document-label">
              {docType.replace(/([A-Z])/g, ' $1').toUpperCase()}:
            </label>
            {!submitComplete && !documents[docType].saved && (
              <input
                type="file"
                id={docType}
                name={docType}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            )}

            {documents[docType].file && (
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${documents[docType].progress}%` }}
                />
                <span>{documents[docType].progress}%</span>
              </div>
            )}

            <button
              className="save-button"
              onClick={() => handleSave(docType)}
              disabled={!documents[docType].file || documents[docType].saved || submitComplete}
            >
              Save
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(docType)}
              disabled={!documents[docType].file || documents[docType].saved || submitComplete}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="document-tracker">
        <h2>Uploaded Documents:</h2>
        <ul>
          {Object.keys(documents).map(
            (docType) =>
              documents[docType].file && (
                <li key={docType}>
                  {docType.replace(/([A-Z])/g, ' $1').toUpperCase()}:{" "}
                  {documents[docType].file.name} - {documents[docType].progress}% -{" "}
                  {documents[docType].saved ? "Saved" : "Not Saved"}
                </li>
              )
          )}
        </ul>
      </div>

      <button className="submit-button" onClick={handleSubmit} disabled={submitComplete}>
        Submit All
      </button>

      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
    </div>
  );
}

export default UploadDocuments;
