const { v4 } = require('uuid');
const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Payment = require('../models/paymentModel');
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_KEY,
});
exports.createOrderId = catchAsync(async (req, res, next) => {
  const receiptId = v4();
  console.log(receiptId);
  const options = {
    amount: +req.body.amount * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: receiptId,
  };
  const order = await instance.orders.create(options);
  const data = {
    orderId: order.id,
    amount: order.amount,
    name: req.user.name,
    email: req.user.email,
    mobile: req.user.mobile,
    user: req.user._id,
  };
  if (!order) return next(new AppError('order id not created'));
  res.status(201).json({
    status: 'success',
    data,
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  let body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;

  var crypto = require('crypto');
  var expectedSignature = await crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY)
    .update(body.toString())
    .digest('hex');
  console.log('sig received ', req.body.razorpay_signature);
  console.log('sig generated ', expectedSignature);
  var response = { signatureIsValid: false };
  if (expectedSignature === req.body.razorpay_signature)
    response = { signatureIsValid: true };
  res.status(200).json({
    status: 'success',
    response,
  });
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.create(req.body);

  res.status(201).json({
    status: 'success',
    payment,
  });
});
exports.getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find().populate('user', 'name');

  res.status(200).json({
    status: 'success',
    payments,
  });
});
exports.getMyPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    payments,
  });
});
exports.deleteAll = catchAsync(async (req, res, next) => {
  await Payment.deleteMany();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
