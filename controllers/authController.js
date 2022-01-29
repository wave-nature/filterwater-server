const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  const { name, email, mobile, connectionFor, password, passwordConfirm } =
    req.body;
  const user = await User.create({
    name,
    email,
    mobile,
    connectionFor,
    password,
    passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    user,
  });
};
