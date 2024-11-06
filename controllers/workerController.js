const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const { createWorker, findWorkerByEmail } = require('../models/workerModel');
const sendEmail = require('../services/emailService');

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

// Function to get accepted service requests for a worker which is not completed
const pendingRequests = async (req, res) => {
    const workerId = req.worker.workerId; // Worker ID from the JWT middleware

    try {
        const query = `
            SELECT * FROM service_requests
            WHERE worker_id = $1 AND accept_reject = true AND completed_status = false;
        `;
        const result = await pool.query(query, [workerId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No accepted service requests found for this worker' });
        }

        res.status(200).json({
            message: 'Accepted service requests fetched successfully',
            acceptedRequests: result.rows
        });
    } catch (error) {
        console.error('Error fetching accepted service requests:', error);
        res.status(500).json({ error: 'Server error while fetching accepted service requests' });
    }
};


// Function to get completed service requests for a worker
const getcompeletedRequests = async (req, res) => {
    const workerId = req.worker.workerId; // Worker ID from the JWT middleware

    try {
        const query = `
            SELECT * FROM service_requests
            WHERE worker_id = $1 AND accept_reject = true AND completed_status = true;
        `;
        const result = await pool.query(query, [workerId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No compeleted service requests found for this worker' });
        }

        res.status(200).json({
            message: 'compeleted service requests fetched successfully',
            acceptedRequests: result.rows
        });
    } catch (error) {
        console.error('Error fetching compeleted service requests:', error);
        res.status(500).json({ error: 'Server error while fetching compeleted service requests' });
    }
};

// Function to  marke pending work completed 
const markAsCompleted = async (req, res) => {
    const { requestId } = req.body; // Get requestId from the request body
    const workerId = req.worker.workerId; // Worker ID from the JWT middleware

    try {
        const result = await pool.query(
            'UPDATE service_requests SET completed_status = true WHERE request_id = $1 AND worker_id = $2 RETURNING *',
            [requestId, workerId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Send email to user notifying about completion

        const serviceRequest = result.rows[0];
        const { email: userEmail, user_name: userName } = serviceRequest;

        const subject = `Service Request Completed - Request ID: ${requestId}`;
        const text = `Hello ${userName},\n\nWe are pleased to inform you that your service request (ID: ${requestId}) has been successfully completed.\n\nThank you for choosing our service!`;

        await sendEmail(userEmail, subject, text);

        return res.status(200).json({
            message: 'Service request marked as completed successfully, and email sent to user',
            request: result.rows[0],
        });

    } catch (error) {
        console.error('Error marking service request as completed:', error);
        return res.status(500).json({ error: 'Server error while updating service request status.' });
    }
};



module.exports = {
    workerSignup,
    workerLogin,
    getMatchingServiceRequests,
    getcompeletedRequests,
    pendingRequests,
    markAsCompleted
};
