const express = require('express');
const { acceptRequest, rejectRequest } = require('../controllers/serviceRequestController');
const authenticateWorkerToken = require('../middlewares/workerMiddleware');

const router = express.Router();

// Accept service request
router.post('/accept', authenticateWorkerToken, acceptRequest);

// Reject service request
router.post('/reject', authenticateWorkerToken, rejectRequest);

module.exports = router;
