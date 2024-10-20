const express = require('express');
const { workerSignup, workerLogin } = require('../controllers/workerController');

const router = express.Router();

// Worker Signup Route
router.post('/signup', workerSignup);

// Worker Login Route
router.post('/login', workerLogin);

module.exports = router;
