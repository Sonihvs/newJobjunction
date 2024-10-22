const express = require('express');
const { workerSignup, workerLogin } = require('../controllers/workerController');
const workerAuthMiddleware = require('../middlewares/workerMiddleware');
const { getMatchingServiceRequests } = require('../controllers/workerController');

const router = express.Router();

// Worker Signup Route
router.post('/signup', workerSignup);

// Worker Login Route
router.post('/login', workerLogin);

// Route to fetch matching service requests for a worker's area and work_type
router.get('/requests', workerAuthMiddleware, getMatchingServiceRequests);

module.exports = router;
