const catchAsync = require('../utils/catchAsync');
const Contact = require('../models/contactModel');
const AppError = require('../utils/AppError');

exports.createContact = catchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;
  const contact = await Contact.create({ name, email, message });
  res.status(201).json({
    status: 'success',
    contact,
  });
});

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find().skip(skip).limit(limit);
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    contacts,
  });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) return next(new AppError('No Contact found with this id', 404));

  res.status(200).json({
    status: 'success',
    contact,
  });
});
exports.deleteContact = catchAsync(async (req, res, next) => {
  await Contact.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
