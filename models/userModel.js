const mongoose = require('mongoose');

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
    password: {
      type: String,
      minlength: 4,
      required: [true, 'user must have a password'],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (val) {
          return val !== this.password;
        },
        message: 'password and password confirm must be same',
      },
      required: [true, 'user must re-enter password'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
