const socketIo = require('socket.io');
const User = require('./models/User'); // Ensure path is correct

const initializeSocketIO = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // Register user with Socket.IO
    socket.on('registerUser', async (userId) => {
      socket.join(userId);
      console.log(`User ${userId} connected`);
    });

    // Handle document submission
    socket.on('submitDocuments', async (data) => {
      console.log('Documents submitted:', data);

      // Update user status in MongoDB
      await User.findByIdAndUpdate(data.userId, { status: 'submitted' });

      // Notify specific user
      io.to(data.userId).emit('documentStatusUpdate', {
        message: 'Documents submitted successfully',
        status: 'submitted',
        userId: data.userId
      });
    });

    // Handle document deletion
    socket.on('deleteDocument', async (data) => {
      console.log('Delete document:', data);

      // Notify specific user
      io.to(data.userId).emit('documentStatusUpdate', {
        message: 'Document deleted',
        status: 'deleted',
        userId: data.userId
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocketIO;
