const express = require('express');
const { bookServiceController } = require('../controllers/bookingController');
const router = express.Router();

router.post('/book-service', bookServiceController);

module.exports = router;
