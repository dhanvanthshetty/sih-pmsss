const mongoose = require('mongoose');

// Define the schema
const financeUserSchema = new mongoose.Schema({
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
financeUserSchema.pre('save', function (next) {
  // Skip password hashing
  next();
});

// Instance method to check if password is valid (without hashing)
financeUserSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

// Static method to create default user
financeUserSchema.statics.createDefaultUser = async function () {
  try {
    const existingUser = await this.findOne({ username: 'finance' });
    if (!existingUser) {
      const defaultUser = new this({
        username: 'finance',
        password: '123', // Plain text password
      });
      await defaultUser.save();
      console.log("Default user 'finance' created with password '123'.");
    } else {
      console.log("Default user 'finance' already exists.");
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

const FinanceUser = mongoose.model('FinanceUser', financeUserSchema);

module.exports = FinanceUser;
