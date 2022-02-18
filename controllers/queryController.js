const catchAsync = require('../utils/catchAsync');
const Query = require('../models/queryModel');
const AppError = require('../utils/AppError');

exports.createQuery = catchAsync(async (req, res, next) => {
  const { title, message } = req.body;
  const query = await Query.create({ user: req.user.id, title, message });
  res.status(201).json({
    status: 'success',
    query,
  });
});

exports.getAllQueries = catchAsync(async (req, res, next) => {
  const queries = await Query.find();
  res.status(200).json({
    status: 'success',
    results: queries.length,
    queries,
  });
});

exports.getQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findById(req.params.id);

  if (!query) return next(new AppError('No query found with this id', 404));

  res.status(200).json({
    status: 'success',
    query,
  });
});
exports.updateQuery = catchAsync(async (req, res, next) => {
  let query;
  if (req.user.role === 'super-admin') {
    const solved = req.body.solved;
    if (req.body.title || req.body.message)
      return next(
        new AppError('You cannot update the query title and message', 401)
      );
    query = await Query.findByIdAndUpdate(
      req.params.id,
      { solved },
      { new: true }
    );
  } else {
    const { title, message } = req.body;
    query = await Query.findByIdAndUpdate(
      req.params.id,
      { title, message },
      { new: true }
    );
  }

  res.status(203).json({
    status: 'success',
    query,
  });
});
exports.deleteQuery = catchAsync(async (req, res, next) => {
  await Query.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
