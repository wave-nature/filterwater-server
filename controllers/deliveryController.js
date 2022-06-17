const Delivery = require('../models/deleveryModel');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createDelivery = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const delivered = req.body.delivered;
  const delivery = await Delivery.create({ user: userId, delivered });

  res.status(201).json({
    status: 'success',
    delivery,
  });
});

exports.getAllDeliveries = catchAsync(async (req, res, next) => {
  const deliveries = await Delivery.find();

  res.status(200).json({
    status: 'success',
    result: deliveries.length,
    deliveries,
  });
});
exports.getDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery)
    return next(new AppError('No delivery found with this id', 404));

  res.status(200).json({
    status: 'success',
    delivery,
  });
});
exports.updateDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    {
      delivered: req.body.delivered,
      extra: req.body.extra || false,
      extraFor: req.body.extraFor || undefined,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    delivery,
  });
});
exports.deleteDelivery = catchAsync(async (req, res, next) => {
  await Delivery.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
exports.getDeliveriesOfSingleUser = catchAsync(async (req, res, next) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formatedMonth = month < 10 ? '0' + month : month;
  let lastDay;
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      lastDay = 31;
      break;
    case 2:
      lastDay = year % 4 === 0 ? 29 : 28;
      break;
    default:
      lastDay = 30;
  }
  const currentUser = req.user;
  let userId;
  if (currentUser.role !== 'user') userId = req.params.id;
  else userId = currentUser.id;
  const user = await User.findById(userId);
  if (!user) return next(new AppError('No user exist with this id', 404));

  const deliveries = await Delivery.find({
    user: userId,
    createdAt: {
      $gte: new Date(`${year}-${formatedMonth}-01`),
      $lte: new Date(`${year}-${formatedMonth}-${lastDay}`),
    },
  });

  res.status(200).json({
    status: 'success',
    results: deliveries.length,
    deliveries,
  });
});

exports.deleteAllDeliveries = async (req, res, next) => {
  await Delivery.deleteMany();
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
