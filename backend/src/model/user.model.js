import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // Hidden by default in queries
  role: { type: String, enum: ['client', 'tester'], required: true },
  company_name: { type: String },
  is_active: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10; // Enterprise standard is 10-12
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  // 'this.password' refers to the hashed password in the DB
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;