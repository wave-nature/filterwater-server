const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

const {
  getAllQueries,
  getQuery,
  createQuery,
  updateQuery,
  deleteQuery,
} = require('../controllers/queryController');

router
  .route('/')
  .get(protect, restrictTo('super-admin'), getAllQueries)
  .post(protect, restrictTo('user'), createQuery);

router
  .route('/:id')
  .get(protect, restrictTo('super-admin', 'user'), getQuery)
  .patch(protect, restrictTo('super-admin', 'user'), updateQuery)
  .delete(protect, restrictTo('super-admin', 'user'), deleteQuery);

module.exports = router;
