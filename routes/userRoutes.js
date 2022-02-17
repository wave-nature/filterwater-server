const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const deliveryRouter = require('../routes/deliveryRoutes');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get(
  '/',
  // authController.protect,
  // authController.restrictTo('super-admin','admin'),
  userController.allUsers
);
router.get('/me', authController.protect, userController.getMe);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.use('/:id/deliver', deliveryRouter);

module.exports = router;
