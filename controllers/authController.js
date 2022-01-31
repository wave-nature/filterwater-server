const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createToken = function (id) {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};

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

  const token = createToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    user,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter email or password', 404));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError('No user found with this email', 404));

  const passwordIsCorrect = await user.checkPassword(password, user.password);

  if (!passwordIsCorrect)
    return next(new AppError('Either email or password is incorrect', 400));

  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});
