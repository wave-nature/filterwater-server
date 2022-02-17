const Delivery = require('../models/deleveryModel');
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
