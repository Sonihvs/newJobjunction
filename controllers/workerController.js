const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createWorker, findWorkerByEmail } = require('../models/workerModel');

// Signup logic for workers
const workerSignup = async (req, res) => {
    const { name, email, phone, password, location, worktype } = req.body;

    // Check if the worker already exists
    const existingWorker = await findWorkerByEmail(email);
    if (existingWorker) {
        return res.status(400).json({ message: 'Worker already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new worker
    const newWorker = await createWorker(name, email, phone, hashedPassword, location, worktype);

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
    const token = jwt.sign({ workerId: worker.srno }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
};

module.exports = {
    workerSignup,
    workerLogin
};
