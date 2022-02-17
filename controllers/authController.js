const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');

const createToken = function (id) {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};

const sendToken = (user, res, statusCode) => {
  const token = createToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure:true
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    mobile,
    connectionFor,
    password,
    passwordConfirm,
    wardNumber,
  } = req.body;
  let role = req.body.role;
  role = !role ? 'user' : role;
  const user = await User.create({
    name,
    email,
    mobile,
    connectionFor: role === 'user' ? connectionFor : 0,
    role,
    wardNumber: wardNumber,
    password,
    passwordConfirm,
  });

  sendToken(user, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter email or password', 404));

  const user = await User.findOne({ email }).select('+password');
  if (!user.active)
    return next(
      new AppError(
        'You just deleted your account, please send email to vivek30bhadouria@gmail.com to activate your account',
        400
      )
    );

  if (!user) return next(new AppError('No user found with this email', 404));

  const passwordIsCorrect = await user.checkPassword(password, user.password);

  if (!passwordIsCorrect)
    return next(new AppError('Either email or password is incorrect', 400));
  sendToken(user, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  //check if token exists in cookie or in headers
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(new AppError('User not logged in. Please login!', 400));
  // verify the token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check user still exist
  const currentUser = await User.findById(payload.id);
  if (!currentUser)
    return next(
      new AppError('Invalid login, user not exist with this credentials', 404)
    );
  // check user changed password or not
  const passwordIsUpdated = currentUser.userChangedPassword(
    payload.iat,
    currentUser.updatedAt
  );
  if (passwordIsUpdated)
    return next(
      new AppError('User currently changed the password, please login again')
    );
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You donot have access for this route', 401));
    else next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const passwordIsCorrect = await user.checkPassword(
    currentPassword,
    user.password
  );

  if (!passwordIsCorrect)
    return next(
      new AppError('current password is incorrect. Please try again!', 400)
    );

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  sendToken(user, res, 201);
});
