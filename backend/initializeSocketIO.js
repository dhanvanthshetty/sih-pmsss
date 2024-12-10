// const socketIo = require('socket.io');
// const { authenticateSocket, sendEmailNotification } = require('./socketHandler');
// const User = require('./models/User'); // Ensure this path is correct

// const initializeSocketIO = (server) => {
//   const io = socketIo(server, {
//     cors: {
//       origin: "http://localhost:3000", // Change this to match your frontend URL
//       methods: ["GET", "POST"]
//     }
//   });

//   // Use the authentication middleware
//   io.use(authenticateSocket);

//   io.on('connection', (socket) => {
//     console.log('Client connected', socket.id);

//     // Handle document submission
//     socket.on('submitDocuments', async () => {
//       try {
//         // Update user status in MongoDB
//         const user = await User.findById(socket.userId);
//         if (user) {
//           user.status = 'submitted';
//           await user.save();

//           // Notify all clients of document submission status
//           io.emit('documentStatusUpdate', {
//             message: 'Documents submitted successfully',
//             status: 'submitted',
//             userId: socket.userId
//           });

//           // Send email notification
//           await sendEmailNotification(user.email, 'Your documents have been successfully submitted.');
//         }
//       } catch (error) {
//         console.error('Error handling document submission:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Client disconnected', socket.id);
//     });
//   });

//   return io;
// };

// module.exports = initializeSocketIO;
