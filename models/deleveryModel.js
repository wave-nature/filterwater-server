const mongoose = require('mongoose');
const User = require('./userModel');

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: ['delivery must have user'],
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    extra: {
      type: Boolean,
      default: false,
    },
    extraFor: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

deliverySchema.pre('save', function (next) {
  if (!this.extra) {
    this.extraFor = undefined;
    next();
  }
  next();
});

deliverySchema.post('save', async function () {
  const userId = this.user;
  const user = await User.findById(userId);
  user.deliveryStatus = this.delivered;
  await user.save({ validateBeforeSave: false });
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
