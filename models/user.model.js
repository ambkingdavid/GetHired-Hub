import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: validator.isEmail
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  location: {
    type: String,
    default: 'Nigeria',
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);