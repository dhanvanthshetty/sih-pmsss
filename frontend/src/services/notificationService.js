import axios from 'axios';

const sendNotification = (message) => {
  return axios.post('/api/notifications/send', { message });
};

export { sendNotification };
