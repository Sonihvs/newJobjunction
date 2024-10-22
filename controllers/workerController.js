const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const { createWorker, findWorkerByEmail } = require('../models/workerModel');

// Signup logic for workers
const workerSignup = async (req, res) => {
    const { name, email, phone, password, area, worktype, city } = req.body;

    // Check if the worker already exists
    const existingWorker = await findWorkerByEmail(email);
    if (existingWorker) {
        return res.status(400).json({ message: 'Worker already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new worker
    const newWorker = await createWorker(name, email, phone, hashedPassword, area, worktype, city);

    res.status(201).json({ message: 'Worker created successfully', worker: newWorker });
};

// Login logic for workers
const workerLogin = async (req, res) => {
    const { email, password } = req.body;

    // Check if the worker exists
    const worker = await findWorkerByEmail(email);
    if (!worker) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ workerId: worker.srno }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.json({ message: 'Login successful', token, workerId: worker.srno});
};

// Fetch all matching service requests for the worker's area and work_type
const getMatchingServiceRequests = async (req, res) => {
    try {
        const workerId = req.worker.workerId; // Get worker's ID from the JWT
        const workerQuery = `SELECT area, worktype, city FROM workers WHERE srno = $1`;
        const workerResult = await pool.query(workerQuery, [workerId]);

        if (workerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Worker not found.' });
        }

        const { area, worktype, city } = workerResult.rows[0];

        // Fetch service requests matching the worker's area and work_type
        const serviceRequestQuery = `
            SELECT * 
            FROM service_requests
            WHERE area = $1
              AND work_type = $2
              AND city = $3
              AND accept_reject = false;
        `;
        const serviceRequests = await pool.query(serviceRequestQuery, [area, worktype, city]);

        if (serviceRequests.rows.length === 0) {
            return res.status(200).json({ message: 'No matching service requests available at this time./ OR already been accepted by another worker.' });
        }

        res.status(200).json({
            message: 'Matching service requests fetched successfully',
            serviceRequests: serviceRequests.rows
        });
    } catch (error) {
        console.error('Error fetching matching service requests:', error);
        res.status(500).json({ error: 'Server error while fetching service requests.' });
    }
};

module.exports = {
    workerSignup,
    workerLogin,
    getMatchingServiceRequests
};
