import React, { useState } from 'react';
import { uploadDocument } from '../services/documentService';
import './DocumentUpload.css'; // Link to the new CSS file

function DocumentUpload() {
  const [documents, setDocuments] = useState([]);

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments([...documents, ...files]);
    uploadDocument(files);
  };

  return (
    <div className="document-upload-container">
      <h2>Upload Documents</h2>
      <input
        type="file"
        className="document-upload-input"
        multiple
        onChange={handleDocumentUpload}
      />
      {documents.length > 0 && (
        <ul className="document-list">
          {documents.map((doc, index) => (
            <li key={index} className="document-item">
              {doc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentUpload;
