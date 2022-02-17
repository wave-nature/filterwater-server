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
    wardNumber: {
      type: Number,
      default: 18,
      required: [true, 'user must have ward number'],
    },
    connectionFor: {
      type: Number,
      enum: [0, 10, 20],
      required: [true, 'user must have valid connection'],
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'super-admin', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      minlength: [4, 'at least 4 characters required'],
      required: [true, 'user must have a password'],
      select: false,
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

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async function (
  userPassword,
  savedPassword
) {
  return await bcrypt.compare(userPassword, savedPassword);
};

userSchema.methods.userChangedPassword = function (jwtIssued, updatedPassword) {
  if (this.updatedAt && this.isModified('password')) {
    const passwordUpdatedAt = parseInt(Date.now(updatedPassword) / 1000, 10);
    console.log(jwtIssued, passwordUpdatedAt);
    return updatedPassword > jwtIssued;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
