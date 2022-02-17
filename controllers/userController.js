const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.allUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(201).json({
    status: 'success',
    result: users.length,
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError('User not found with this id', 404));

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new AppError('User not found with this id', 404));

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'Please use /updatePassword route to update your passsword',
        400
      )
    );

  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(203).json({
    status: 'success',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('You cannot change user password', 403));
  const { name, email, mobile, address, wardNumber, connectionFor, role } =
    req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, mobile, address, wardNumber, connectionFor },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(203).json({
    status: 'success',
    user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.active = false;
  await user.save({ validateBeforeSave: false });

  res.status(203).json({
    status: 'success',
    message: 'your account is deleted temporarly',
  });
});
