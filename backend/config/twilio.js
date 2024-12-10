const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are not set in environment variables');
}

const client = new twilio(accountSid, authToken);

module.exports = client;
