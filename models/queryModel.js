const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'query must belong to user'],
    },
    title: {
      type: String,
      required: [true, 'query must have title'],
    },
    message: {
      type: String,
      required: [true, 'query must have a message'],
    },
    solved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
