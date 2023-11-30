import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
  firstName: {
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
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    select: true,
  },
  location: {
    type: String,
    default: 'Nigeria',
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function() {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.validatePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
}

userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this.id}, process.env.JWT_SECRET);
}

export default mongoose.model('User', userSchema);
