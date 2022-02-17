const mongoose = require('mongoose');

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

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
