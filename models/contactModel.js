const mongooose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: [true, 'user must have a name'],
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Not a valid email'],
      required: [true, 'user must have a name'],
    },
    message: {
      type: String,
      required: [true, 'user must have a name'],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongooose.model('Contact', contactSchema);

module.exports = Contact;
