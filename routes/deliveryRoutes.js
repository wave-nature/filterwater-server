const express = require('express');
const authController = require('../controllers/authController');
const deliveryController = require('../controllers/deliveryController');
const { protect, restrictTo } = authController;
const {
  createDelivery,
  getAllDeliveries,
  getDelivery,
  updateDelivery,
  deleteDelivery,
} = deliveryController;

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(protect, restrictTo('super-admin', 'admin'), createDelivery)
  .get(protect, getAllDeliveries);

router
  .route('/:id')
  .get(getDelivery)
  .patch(updateDelivery)
  .delete(deleteDelivery);

module.exports = router;
