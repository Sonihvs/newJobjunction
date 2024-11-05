const express = require('express');
const { bookServiceController, pendingRequests, getcompeletedRequests } = require('../controllers/bookingController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/book-service', authenticateToken, bookServiceController);
router.get('/pendingRequests', authenticateToken, pendingRequests);
router.get('/compeleted-requests', authenticateToken, getcompeletedRequests);

module.exports = router;
