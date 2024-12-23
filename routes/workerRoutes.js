const express = require('express');
const { workerSignup, workerLogin } = require('../controllers/workerController');
const workerAuthMiddleware = require('../middlewares/workerMiddleware');
const { getMatchingServiceRequests, getcompeletedRequests, pendingRequests, markAsCompleted } = require('../controllers/workerController');

const router = express.Router();

// Worker Signup Route
router.post('/signup', workerSignup);

// Worker Login Route
router.post('/login', workerLogin);

// Route to fetch matching service requests for a worker's area and work_type
router.get('/requests', workerAuthMiddleware, getMatchingServiceRequests);

// Route to get all compeleted service requests for a worker
router.get('/compeleted-requests', workerAuthMiddleware, getcompeletedRequests);

// Route to get all accepted but completed service requests for a worker
router.get('/pending-requests', workerAuthMiddleware, pendingRequests );

// Rout to mark pending work as completed
router.patch('/mark-completed', workerAuthMiddleware, markAsCompleted);


module.exports = router;
