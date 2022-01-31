const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'user must have a name'],
    },
    email: {
      type: String,
      required: [true, 'user must have an email'],
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      maxlength: '10',
      unique: true,
      required: [true, 'user must have mobile number'],
    },
    address: {
      type: String,
    },
    connectionFor: {
      type: Number,
      enum: [10, 20],
      required: [true, 'user must have valid connection'],
    },
    role: {
      type: String,
      enum: ['admin', 'super-admin', 'user'],
      default: 'user',
    },
    password: {
      type: String,
      minlength: 4,
      required: [true, 'user must have a password'],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'password and confirm password are not same',
      },
      required: [true, 'user must re-enter password'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.checkPassword = async function (
  userPassword,
  savedPassword
) {
  return await bcrypt.compare(userPassword, savedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
