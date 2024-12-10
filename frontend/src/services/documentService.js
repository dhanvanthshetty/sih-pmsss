import axios from 'axios';

const uploadDocument = (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('documents', file));

  return axios.post('/api/documents/upload', formData)
    .then(response => console.log('Upload successful:', response.data))
    .catch(error => console.error('Upload error:', error));
};

export { uploadDocument };
