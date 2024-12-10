require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const initializeSocketIO = require('./socketHandler'); // Import the Socket.IO handler
const SagUser = require('./models/SagUser');  // Import the SagUser model
const FinanceUser = require('./models/FinanceUser');  // Import the FinanceUser model
const applicationStatusRoutes = require('./routes/applicationStatusRoutes');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const sageRoutes = require('./routes/bureauRoutes');  // Import Sage routes
const financeRoutes = require('./routes/financeRoutes'); // Import Finance routes
const userRoutes = require('./routes/userRoutes');



const app = express();
const server = http.createServer(app);
const io = initializeSocketIO(server); // Initialize Socket.IO

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

app.use('/uploads', express.static('uploads'));
app.use('/api/sage', sageRoutes);  // Add Sage routes
app.use('/api/finance', financeRoutes); // Add Finance routes
app.use('/api', applicationStatusRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
     SagUser.createDefaultUser();
     FinanceUser.createDefaultUser(); // Ensure this function exists

    server.listen(PORT, () => {
      console.log(`Server runing on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = { app, server, io }; // Export `io` if needed in other modules
