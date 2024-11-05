const express = require('express');
const { bookServiceController } = require('../controllers/bookingController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/book-service', authenticateToken, bookServiceController);

module.exports = router;
