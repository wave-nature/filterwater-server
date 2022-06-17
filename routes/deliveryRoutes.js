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
  getDeliveriesOfSingleUser,
  deleteAllDeliveries,
} = deliveryController;

const router = express.Router({ mergeParams: true });

router.get('/myDeliveries', protect, getDeliveriesOfSingleUser);
router.delete('/deleteAll', deleteAllDeliveries);
router
  .route('/')
  .get(protect, restrictTo('super-admin', 'admin'), getDeliveriesOfSingleUser)
  .get(protect, restrictTo('super-admin'), getAllDeliveries)
  .post(protect, restrictTo('super-admin', 'admin'), createDelivery);

router
  .route('/:id')
  .get(getDelivery)
  .patch(updateDelivery)
  .delete(deleteDelivery);

module.exports = router;
