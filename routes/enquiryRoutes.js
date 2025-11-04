// routes/enquiryRoutes.js
const express = require('express');
const {
  submitPublicEnquiry,
  getPublicEnquiries,
  getPrivateEnquiries,
  claimEnquiry,
} = require('../controllers/enquiryController');
const protect = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/public', submitPublicEnquiry);
router.get('/public', protect, getPublicEnquiries);

// Protected routes
router.get('/private', protect, getPrivateEnquiries);
router.patch('/:id/claim', protect, claimEnquiry);

module.exports = router;