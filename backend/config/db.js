const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/yourDBName', {
      useNewUrlParser: true,
      
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;
