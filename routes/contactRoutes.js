const express = require('express');
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const { protect, restrictTo } = authController;
const { createContact, getAllContacts, getContact, deleteContact } =
  contactController;

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(createContact)
  .get(protect, restrictTo('super-admin'), getAllContacts);

router.use(protect, restrictTo('super-admin'));
router.route('/:id').get(getContact).delete(deleteContact);

module.exports = router;
