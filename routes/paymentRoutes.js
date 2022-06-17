const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(paymentController.createPayment)
  .get(authController.protect, paymentController.getAllPayments)
  .delete(paymentController.deleteAll);

router.post(
  '/orderId',
  authController.protect,
  paymentController.createOrderId
);
router.post('/verify', paymentController.verifyPayment);

router.get('/my', authController.protect, paymentController.getMyPayments);

module.exports = router;
