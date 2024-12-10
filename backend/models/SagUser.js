const mongoose = require('mongoose');

// Define the schema
const sagUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook to skip hashing (not recommended for security)
sagUserSchema.pre('save', function (next) {
  // Skip password hashing
  next();
});

// Instance method to check if password is valid (without hashing)
sagUserSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

// Static method to create default user
sagUserSchema.statics.createDefaultUser = async function () {
  try {
    const existingUser = await this.findOne({ username: 'sag' });
    if (!existingUser) {
      const defaultUser = new this({
        username: 'sag',
        password: '123', // Plain text password
      });
      await defaultUser.save();
      console.log("Default user 'sag' created with password '123'.");
    } else {
      console.log("Default user 'sag' already exists.");
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

const SagUser = mongoose.model('SagUser', sagUserSchema);

module.exports = SagUser;