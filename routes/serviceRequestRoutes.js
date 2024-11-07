const express = require('express');
const { acceptRequest, rejectRequest } = require('../controllers/serviceRequestController');
const authenticateWorkerToken = require('../middlewares/workerMiddleware');

const router = express.Router();

// Accept service request
router.patch('/accept', authenticateWorkerToken, acceptRequest);

// Reject service request
router.patch('/reject', authenticateWorkerToken, rejectRequest);

module.exports = router;
