import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DocumentUploadTable.css';

const DocumentUploadTable = () => {
  const [documents, setDocuments] = useState([
    { id: 1, type: 'Passport Size Photograph', status: 'Not Uploaded' },
    { id: 2, type: "Applicant's Signature", status: 'Not Uploaded' },
    { id: 3, type: 'Domicile Certificate of J&K', status: 'Not Uploaded' },
    { id: 4, type: 'Category Certificate (if applicable)', status: 'Not Uploaded' },
    { id: 5, type: 'Aadhaar Card', status: 'Not Uploaded' },
    { id: 6, type: 'Class 10 Marksheet', status: 'Not Uploaded' },
    { id: 7, type: 'Class 12 Marksheet', status: 'Not Uploaded' },
    { id: 8, type: 'Diploma Certificate (for lateral entry students only)', status: 'Not Uploaded' },
    { id: 9, type: 'Disability Certificate (if applicable)', status: 'Not Uploaded' },
    { id: 10, type: 'Family Income Certificate', status: 'Not Uploaded' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents/retrieve', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => {
          const uploadedDoc = response.data.find((d) => d.type === doc.type);
          return {
            ...doc,
            status: uploadedDoc ? 'Already Submitted' : 'Not Uploaded',
            filePath: uploadedDoc ? uploadedDoc.filePath : null
          };
        })
      );
    } catch (error) {
      console.error('Failed to fetch documents', error);
    }
  };

  const handleFileChange = async (e, docId) => {
    const file = e.target.files[0];
    const document = documents.find((doc) => doc.id === docId);

    if (!file) {
      alert('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', document.type);

    try {
      const response = await axios.post(`/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      // Update the document status to "Uploaded"
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === docId ? { ...doc, status: 'Uploaded', filePath: response.data.filePath } : doc
        )
      );
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload file', error);
      alert('Error uploading file.');
    }
  };

  const handleFinalSubmit = async () => {
    // Check if any document is still "Not Uploaded"
    const notUploaded = documents.some((doc) => doc.status === 'Not Uploaded');
    if (notUploaded) {
      alert('Please upload all required documents before final submission.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/documents/finalSubmit', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Documents submitted successfully');
      console.log(response.data);

      await fetchDocuments();  // Fetch the latest documents after submission
    } catch (error) {
      console.error('Failed to submit documents', error);
      alert('Error submitting documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable Final Submit button if there are any documents not uploaded
  const allDocumentsUploaded = documents.every((doc) => doc.status === 'Uploaded' || doc.status === 'Already Submitted');

  return (
    <div className="document-upload-table">
      <table>
        <thead>
          <tr>
            <th>SNO.</th>
            <th>Documents Type</th>
            <th>Status</th>
            <th>View Document</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr key={doc.id}>
              <td>{index + 1}</td>
              <td>{doc.type}</td>
              <td>{doc.status}</td>
              <td>
                {doc.filePath ? (
                  <a href={doc.filePath} target="_blank" rel="noopener noreferrer">View</a>
                ) : (
                  'Not Available'
                )}
              </td>
              <td>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, doc.id)}
                  disabled={doc.status === 'Uploaded' || doc.status === 'Already Submitted'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <button className="submit" onClick={handleFinalSubmit} disabled={!allDocumentsUploaded || isSubmitting}>
          Final Submit
        </button>
      </div>
    </div>
  );
};

export default DocumentUploadTable;
