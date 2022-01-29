const User = require('../models/userModel');

exports.allUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(201).json({
    status: 'success',
    result: users.length,
    users,
  });
};
