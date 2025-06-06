import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
       validate: {
    validator: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Regex for email validation
    },
    message: props => `${props.value} is not a valid email!` // Custom error message
  }
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

userSchema.pre('save', async function (next) {

 if (!this.isModified('password')) {

  return next();

 }

  

 try {

  // Generate a salt (default 10 rounds)

  const salt = await bcrypt.genSalt(10);

  // Hash the password field with the generated salt

  this.password = await bcrypt.hash(this.password, salt);

  return next();

 } catch (err) {

  return next(err);

 }

});

  

// Optional: instance method to compare candidate password during login

userSchema.methods.comparePassword = async function (candidatePassword) {

 return await bcrypt.compare(candidatePassword, this.password);

};

userSchema.index({ email: 1 }, { unique: true });  

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;